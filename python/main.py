import os
import yaml
from fastapi import FastAPI, HTTPException, Path, Request, Response, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse, PlainTextResponse
from fastapi.openapi.docs import get_swagger_ui_html
from pydantic import BaseModel, Field
from typing import List, Optional
import sqlite3
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), "sns_api.db")
OPENAPI_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "openapi.yaml")

# --- Load OpenAPI YAML ---
import sys
try:
    with open(OPENAPI_PATH, "r", encoding="utf-8") as f:
        openapi_yaml = f.read()
        openapi_dict = yaml.safe_load(openapi_yaml)
except Exception as e:
    print(f"[Startup Error] Failed to load openapi.yaml: {e}", file=sys.stderr)
    openapi_yaml = ''
    openapi_dict = {}

# --- Pydantic Models (from openapi.yaml schemas) ---
class Post(BaseModel):
    id: str
    username: str
    content: str
    createdAt: datetime
    updatedAt: datetime
    likeCount: int
    commentCount: int

class PostCreateRequest(BaseModel):
    username: str
    content: str

class PostUpdateRequest(BaseModel):
    username: str
    content: str

class Comment(BaseModel):
    id: str
    postId: str
    username: str
    content: str
    createdAt: datetime
    updatedAt: datetime

class CommentCreateRequest(BaseModel):
    username: str
    content: str

class CommentUpdateRequest(BaseModel):
    username: str
    content: str

class LikeRequest(BaseModel):
    username: str

class Error(BaseModel):
    message: str

# --- Database Initialization ---
def init_db():
    import sys
    try:
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        # Posts table
        c.execute("""
        CREATE TABLE IF NOT EXISTS posts (
            id TEXT PRIMARY KEY,
            username TEXT NOT NULL,
            content TEXT NOT NULL,
            createdAt TEXT NOT NULL,
            updatedAt TEXT NOT NULL
        )
        """)
        # Comments table
        c.execute("""
        CREATE TABLE IF NOT EXISTS comments (
            id TEXT PRIMARY KEY,
            postId TEXT NOT NULL,
            username TEXT NOT NULL,
            content TEXT NOT NULL,
            createdAt TEXT NOT NULL,
            updatedAt TEXT NOT NULL,
            FOREIGN KEY(postId) REFERENCES posts(id) ON DELETE CASCADE
        )
        """)
        # Likes table
        c.execute("""
        CREATE TABLE IF NOT EXISTS likes (
            postId TEXT NOT NULL,
            username TEXT NOT NULL,
            PRIMARY KEY (postId, username),
            FOREIGN KEY(postId) REFERENCES posts(id) ON DELETE CASCADE
        )
        """)
        conn.commit()
        conn.close()
    except Exception as e:
        print(f"[Startup Error] Failed to initialize DB: {e}", file=sys.stderr)

# --- FastAPI App ---
app = FastAPI(openapi_url=None, docs_url=None, redoc_url=None)

# CORS: allow all
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    init_db()

# --- Serve OpenAPI YAML ---
@app.get("/openapi.yaml", include_in_schema=False)
def get_openapi_yaml():
    return PlainTextResponse(openapi_yaml, media_type="text/yaml")

# --- Serve Swagger UI ---
@app.get("/docs", include_in_schema=False)
def custom_swagger_ui_html():
    return get_swagger_ui_html(
        openapi_url="/openapi.json",
        title="Simple Social Media Application API Docs"
    )

# --- OpenAPI JSON endpoint (matches YAML) ---
@app.get("/openapi.json", include_in_schema=False)
def get_openapi_json():
    return JSONResponse(openapi_dict)

# --- Helper functions for DB ---
import uuid
def now_iso():
    return datetime.utcnow().isoformat() + "Z"

def get_db():
    return sqlite3.connect(DB_PATH)

# --- API Endpoints (implement exactly as in openapi.yaml) ---
# /posts GET
@app.get("/posts", response_model=List[Post])
def list_posts():
    conn = get_db()
    c = conn.cursor()
    c.execute("SELECT id, username, content, createdAt, updatedAt FROM posts ORDER BY createdAt DESC")
    posts = c.fetchall()
    result = []
    for row in posts:
        post_id = row[0]
        c.execute("SELECT COUNT(*) FROM likes WHERE postId=?", (post_id,))
        like_count = c.fetchone()[0]
        c.execute("SELECT COUNT(*) FROM comments WHERE postId=?", (post_id,))
        comment_count = c.fetchone()[0]
        result.append(Post(
            id=row[0], username=row[1], content=row[2],
            createdAt=row[3], updatedAt=row[4],
            likeCount=like_count, commentCount=comment_count
        ))
    conn.close()
    return result

# /posts POST
@app.post("/posts", response_model=Post, status_code=201)
def create_post(body: PostCreateRequest):
    post_id = str(uuid.uuid4())
    now = now_iso()
    conn = get_db()
    c = conn.cursor()
    c.execute("INSERT INTO posts (id, username, content, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)",
              (post_id, body.username, body.content, now, now))
    conn.commit()
    conn.close()
    return Post(id=post_id, username=body.username, content=body.content, createdAt=now, updatedAt=now, likeCount=0, commentCount=0)

# /posts/{postId} GET
@app.get("/posts/{postId}", response_model=Post)
def get_post(postId: str = Path(...)):
    conn = get_db()
    c = conn.cursor()
    c.execute("SELECT id, username, content, createdAt, updatedAt FROM posts WHERE id=?", (postId,))
    row = c.fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="Post not found")
    c.execute("SELECT COUNT(*) FROM likes WHERE postId=?", (postId,))
    like_count = c.fetchone()[0]
    c.execute("SELECT COUNT(*) FROM comments WHERE postId=?", (postId,))
    comment_count = c.fetchone()[0]
    conn.close()
    return Post(id=row[0], username=row[1], content=row[2], createdAt=row[3], updatedAt=row[4], likeCount=like_count, commentCount=comment_count)

# /posts/{postId} PATCH
@app.patch("/posts/{postId}", response_model=Post)
def update_post(postId: str = Path(...), body: PostUpdateRequest = None):
    conn = get_db()
    c = conn.cursor()
    c.execute("SELECT id FROM posts WHERE id=?", (postId,))
    if not c.fetchone():
        conn.close()
        raise HTTPException(status_code=404, detail="Post not found")
    now = now_iso()
    c.execute("UPDATE posts SET username=?, content=?, updatedAt=? WHERE id=?",
              (body.username, body.content, now, postId))
    conn.commit()
    c.execute("SELECT id, username, content, createdAt, updatedAt FROM posts WHERE id=?", (postId,))
    row = c.fetchone()
    c.execute("SELECT COUNT(*) FROM likes WHERE postId=?", (postId,))
    like_count = c.fetchone()[0]
    c.execute("SELECT COUNT(*) FROM comments WHERE postId=?", (postId,))
    comment_count = c.fetchone()[0]
    conn.close()
    return Post(id=row[0], username=row[1], content=row[2], createdAt=row[3], updatedAt=row[4], likeCount=like_count, commentCount=comment_count)

# /posts/{postId} DELETE
@app.delete("/posts/{postId}", status_code=204)
def delete_post(postId: str = Path(...)):
    conn = get_db()
    c = conn.cursor()
    c.execute("SELECT id FROM posts WHERE id=?", (postId,))
    if not c.fetchone():
        conn.close()
        raise HTTPException(status_code=404, detail="Post not found")
    c.execute("DELETE FROM posts WHERE id=?", (postId,))
    conn.commit()
    conn.close()
    return Response(status_code=204)

# /posts/{postId}/comments GET
@app.get("/posts/{postId}/comments", response_model=List[Comment])
def list_comments(postId: str = Path(...)):
    conn = get_db()
    c = conn.cursor()
    c.execute("SELECT id, postId, username, content, createdAt, updatedAt FROM comments WHERE postId=? ORDER BY createdAt ASC", (postId,))
    rows = c.fetchall()
    conn.close()
    return [Comment(id=row[0], postId=row[1], username=row[2], content=row[3], createdAt=row[4], updatedAt=row[5]) for row in rows]

# /posts/{postId}/comments POST
@app.post("/posts/{postId}/comments", response_model=Comment, status_code=201)
def create_comment(postId: str = Path(...), body: CommentCreateRequest = None):
    comment_id = str(uuid.uuid4())
    now = now_iso()
    conn = get_db()
    c = conn.cursor()
    c.execute("SELECT id FROM posts WHERE id=?", (postId,))
    if not c.fetchone():
        conn.close()
        raise HTTPException(status_code=404, detail="Post not found")
    c.execute("INSERT INTO comments (id, postId, username, content, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)",
              (comment_id, postId, body.username, body.content, now, now))
    conn.commit()
    conn.close()
    return Comment(id=comment_id, postId=postId, username=body.username, content=body.content, createdAt=now, updatedAt=now)

# /posts/{postId}/comments/{commentId} GET
@app.get("/posts/{postId}/comments/{commentId}", response_model=Comment)
def get_comment(postId: str = Path(...), commentId: str = Path(...)):
    conn = get_db()
    c = conn.cursor()
    c.execute("SELECT id, postId, username, content, createdAt, updatedAt FROM comments WHERE id=? AND postId=?", (commentId, postId))
    row = c.fetchone()
    conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="Comment not found")
    return Comment(id=row[0], postId=row[1], username=row[2], content=row[3], createdAt=row[4], updatedAt=row[5])

# /posts/{postId}/comments/{commentId} PATCH
@app.patch("/posts/{postId}/comments/{commentId}", response_model=Comment)
def update_comment(postId: str = Path(...), commentId: str = Path(...), body: CommentUpdateRequest = None):
    conn = get_db()
    c = conn.cursor()
    c.execute("SELECT id FROM comments WHERE id=? AND postId=?", (commentId, postId))
    if not c.fetchone():
        conn.close()
        raise HTTPException(status_code=404, detail="Comment not found")
    now = now_iso()
    c.execute("UPDATE comments SET username=?, content=?, updatedAt=? WHERE id=? AND postId=?",
              (body.username, body.content, now, commentId, postId))
    conn.commit()
    c.execute("SELECT id, postId, username, content, createdAt, updatedAt FROM comments WHERE id=? AND postId=?", (commentId, postId))
    row = c.fetchone()
    conn.close()
    return Comment(id=row[0], postId=row[1], username=row[2], content=row[3], createdAt=row[4], updatedAt=row[5])

# /posts/{postId}/comments/{commentId} DELETE
@app.delete("/posts/{postId}/comments/{commentId}", status_code=204)
def delete_comment(postId: str = Path(...), commentId: str = Path(...)):
    conn = get_db()
    c = conn.cursor()
    c.execute("SELECT id FROM comments WHERE id=? AND postId=?", (commentId, postId))
    if not c.fetchone():
        conn.close()
        raise HTTPException(status_code=404, detail="Comment not found")
    c.execute("DELETE FROM comments WHERE id=? AND postId=?", (commentId, postId))
    conn.commit()
    conn.close()
    return Response(status_code=204)

# /posts/{postId}/likes POST
@app.post("/posts/{postId}/likes", status_code=201)
def like_post(postId: str = Path(...), body: LikeRequest = None):
    conn = get_db()
    c = conn.cursor()
    c.execute("SELECT id FROM posts WHERE id=?", (postId,))
    if not c.fetchone():
        conn.close()
        raise HTTPException(status_code=404, detail="Post not found")
    try:
        c.execute("INSERT INTO likes (postId, username) VALUES (?, ?)", (postId, body.username))
        conn.commit()
    except sqlite3.IntegrityError:
        conn.close()
        raise HTTPException(status_code=400, detail="Already liked")
    conn.close()
    return Response(status_code=201)

# /posts/{postId}/likes DELETE
@app.delete("/posts/{postId}/likes", status_code=204)
def unlike_post(postId: str = Path(...), body: LikeRequest = None):
    conn = get_db()
    c = conn.cursor()
    c.execute("SELECT id FROM posts WHERE id=?", (postId,))
    if not c.fetchone():
        conn.close()
        raise HTTPException(status_code=404, detail="Post not found")
    c.execute("DELETE FROM likes WHERE postId=? AND username=?", (postId, body.username))
    conn.commit()
    conn.close()
    return Response(status_code=204)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
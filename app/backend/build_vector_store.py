import os

from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import (
    TextLoader,
    PyPDFLoader
)

from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings

all_documents = []

# LOAD TXT FILES
docs_path = "docs"

for file in os.listdir(docs_path):

    if file.endswith(".txt"):

        loader = TextLoader(
            os.path.join(docs_path, file),
            encoding="utf-8"
        )

        documents = loader.load()

        all_documents.extend(documents)

# LOAD PDF FILES
pdfs_path = "pdfs"

for file in os.listdir(pdfs_path):

    if file.endswith(".pdf"):

        loader = PyPDFLoader(
            os.path.join(pdfs_path, file)
        )

        documents = loader.load()

        all_documents.extend(documents)

# CHUNKING
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=100
)

docs = text_splitter.split_documents(all_documents)

# EMBEDDINGS
embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

# VECTOR DB
vectorstore = FAISS.from_documents(
    docs,
    embeddings
)

vectorstore.save_local("faiss_index")

print("Enterprise vector database created successfully!")
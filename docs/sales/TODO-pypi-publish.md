# TODO: Publish to PyPI

## Packages Ready to Publish

### 1. llama-index-readers-builtsimple
- **GitHub:** https://github.com/Built-Simple/llama-index-readers-builtsimple
- **Built package:** `/tmp/llama-index-readers-builtsimple/dist/`
- **Status:** Built, needs PyPI token

### 2. langchain-builtsimple  
- **GitHub:** https://github.com/Built-Simple/langchain-builtsimple
- **Built package:** Needs to run `python3 -m build`
- **Status:** Needs PyPI token

## To Publish

1. Get PyPI API token from https://pypi.org/manage/account/token/
2. SSH to Giratina and run:

```bash
# Create .pypirc
cat > ~/.pypirc << 'EOF'
[pypi]
username = __token__
password = pypi-YOUR_TOKEN_HERE
EOF

# Publish LlamaIndex package
cd /tmp/llama-index-readers-builtsimple
twine upload dist/*

# Build and publish LangChain package
cd /tmp/langchain-builtsimple
python3 -m build
twine upload dist/*
```

## Alternative: GitHub Install (Works Now)

```bash
pip install git+https://github.com/Built-Simple/langchain-builtsimple.git
pip install git+https://github.com/Built-Simple/llama-index-readers-builtsimple.git
```

---
*Created: 2026-01-31*

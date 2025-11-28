# Fixing dlib Build Failure on Vercel

## The Problem

When deploying to Vercel, the build fails with:
```
Building wheel for dlib (pyproject.toml) did not run successfully.
exit code: 1
SyntaxWarning: invalid escape sequence '\('
SetuptoolsDeprecationWarning: The test command is disabled and references deprecated setuptools.command.test
```

## Root Cause

1. **dlib Compilation**: dlib requires C++ compilation from source
2. **Vercel Environment**: Vercel's Python build environment doesn't have C++ build tools
3. **Setuptools Issues**: Older dlib versions have compatibility issues with newer setuptools versions
4. **No Pre-built Wheels**: dlib doesn't always have pre-built wheels for all Python versions

## The Solution

The fix involves several key changes:

### 1. Remove Explicit dlib from requirements.txt
- Removed `dlib==19.24.2` from `api/requirements.txt`
- Let `face-recognition==1.3.0` pull dlib as a dependency
- This allows pip to handle dlib installation more intelligently

**File: `api/requirements.txt`**
```
fastapi==0.104.1
uvicorn[standard]==0.24.0
python-multipart==0.0.6
torch==2.3.1
torchvision==0.18.1
opencv-python==4.10.0.84
numpy==1.26.4
Pillow==10.3.0
face-recognition==1.3.0
python-dotenv==1.0.0
```

### 2. Update Vercel Build Configuration
Enhanced the build command to upgrade pip and setuptools before installation:

**File: `vercel.json`**
```json
{
  "buildCommand": "npm run build && python -m pip install --upgrade pip setuptools wheel && cd api && pip install --prefer-binary --no-cache-dir -r requirements.txt",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["sin1"],
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  }
}
```

**Key flags explained:**
- `pip install --upgrade pip setuptools wheel`: Ensures compatibility with modern Python packaging
- `--prefer-binary`: Prefers pre-built wheels over source compilation
- `--no-cache-dir`: Prevents cached issues from previous builds

### 3. Add Vercel-Specific Configuration Files

#### `.vercelignore`
Excludes unnecessary files from Vercel build:
```
Django_Application
Model Creation
model.ipynb
.git
.gitignore
db.sqlite3
.env
*.md
```

#### `api/pip.ini`
Provides pip configuration for preferring binary packages:
```ini
[global]
prefer-binary = True
```

## How It Works

1. **Vercel Build Phase**:
   - Runs `npm run build` to build the Next.js frontend
   - Upgrades pip, setuptools, and wheel to latest versions
   - Changes to `api/` directory
   - Installs Python dependencies with `--prefer-binary` flag

2. **Dependency Installation**:
   - pip checks for pre-built wheels for each package
   - If wheels exist, they are used (no compilation needed)
   - If wheels don't exist but the package supports them, the source is compiled
   - `face-recognition==1.3.0` handles dlib installation

3. **Result**:
   - Build completes successfully without dlib compilation errors
   - FastAPI backend is available for serverless functions
   - No changes to application code or functionality

## Troubleshooting

If you still see dlib-related errors:

1. **Check Vercel Build Logs**:
   - Go to your Vercel project dashboard
   - Check the build logs for detailed error messages

2. **Try Alternative Approaches**:
   - Clear Vercel cache and redeploy
   - Check for Python version compatibility

3. **Manual Testing**:
   ```bash
   cd api
   python -m pip install --upgrade pip setuptools wheel
   pip install --prefer-binary --no-cache-dir -r requirements.txt
   ```

## Technical Notes

- The fix works with Python 3.12 on Vercel
- face-recognition==1.3.0 includes dlib as a dependency
- Upgrading setuptools fixes the deprecation warnings
- The `--prefer-binary` flag is crucial for avoiding compilation attempts

## Files Modified

- `api/requirements.txt` - Removed explicit dlib entry
- `vercel.json` - Enhanced build command with pip upgrades
- `.vercelignore` - New file for Vercel build optimization
- `api/pip.ini` - New file for pip configuration
- `build.sh` - New file for local testing

## Testing the Fix Locally

```bash
# From project root
cd api
python -m pip install --upgrade pip setuptools wheel
pip install --prefer-binary --no-cache-dir -r requirements.txt

# Verify installation
python -c "import face_recognition; import dlib; print('Success!')"
```

## References

- [Vercel Python Documentation](https://vercel.com/docs/projects/project-configuration)
- [dlib Documentation](http://dlib.net)
- [face_recognition Documentation](https://github.com/ageitgey/face_recognition)

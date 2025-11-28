# Legacy Django Application

This directory contains the original Django application. While the project has been modernized with Next.js and FastAPI, the Django application remains functional and can be used as a reference or for legacy support.

## 📁 Structure

- `ml_app/` - Main Django application with ML processing logic
- `project_settings/` - Django project settings
- `static/` - Static assets (CSS, JS, images)
- `templates/` - HTML templates
- `uploaded_videos/` - Uploaded video files
- `uploaded_images/` - Processed images

## 🚀 Running the Django App

1. **Install dependencies**
   ```bash
   cd Django_Application
   pip install -r requirements.txt
   ```

2. **Run migrations**
   ```bash
   python manage.py migrate
   ```

3. **Start the server**
   ```bash
   python manage.py runserver
   ```

4. **Access the application**
   Open http://localhost:8000 in your browser

## 🔗 Integration with Modern Stack

The ML processing logic from `ml_app/views.py` can be integrated into the new FastAPI backend:

1. Copy the model loading and inference functions
2. Adapt them for FastAPI's async architecture
3. Update file handling for serverless compatibility

## 📝 Notes

- The Django app uses SQLite by default
- Face detection uses dlib and face_recognition libraries
- PyTorch models should be placed in the `/models` directory
- Static files are served from the `static/` directory

## 🔄 Migration Path

To migrate Django functionality to the new stack:

1. **ML Models**: Copy PyTorch model loading code
2. **Views**: Convert Django views to FastAPI endpoints
3. **Templates**: Replace with React components
4. **Static Files**: Move to Next.js public directory
5. **Database**: Consider migrating to PostgreSQL for production
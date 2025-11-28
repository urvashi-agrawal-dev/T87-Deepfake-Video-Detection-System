# from django.shortcuts import render

# Create your views here.


# from django.http import JsonResponse
# import torch
# import os

# def detect_deepfake(request):
#     video_path = "path/to/your/test/video.mp4"
#     model_path = "./models/model_best.pt"
#     model = torch.load(model_path, map_location="cpu")
    
#     # Your inference logic here
#     # ...
    
#     return JsonResponse({"result": "Real or Fake"})


from django.shortcuts import render
from django.core.files.storage import FileSystemStorage
import torch
import os

# Path to your trained model
MODEL_PATH = os.path.join('models', 'model_best.pt')

def index(request):
    return render(request, 'index.html')  # Your upload page

def predict_page(request):
    if request.method == 'POST' and request.FILES['file']:
        uploaded_file = request.FILES['file']
        fs = FileSystemStorage()
        file_path = fs.save(uploaded_file.name, uploaded_file)
        full_path = fs.path(file_path)

        # --- Load your model (make sure it exists) ---
        if not os.path.exists(MODEL_PATH):
            return render(request, 'result.html', {'error': 'Model file not found!'})

        model = torch.load(MODEL_PATH, map_location='cpu')
        model.eval()

        # --- Dummy prediction just for testing ---
        # Later you’ll replace this with real deepfake detection logic
        result = "Real" if "real" in uploaded_file.name.lower() else "Fake"

        return render(request, 'result.html', {
            'filename': uploaded_file.name,
            'result': result
        })

    return render(request, 'index.html')

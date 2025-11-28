#!/usr/bin/env python3
import os
import torch
import sys
# Ensure project dir is in path
PROJECT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, PROJECT_DIR)

# Import the Model class from the app (this will import dependencies defined in views.py)
from ml_app.views import Model

if __name__ == '__main__':
    # instantiate CPU model
    model = Model(2)
    # create models dir if not exists
    models_dir = os.path.join(PROJECT_DIR, 'models')
    os.makedirs(models_dir, exist_ok=True)
    # save a random initialized state_dict with filename that encodes sequence length 20 at index 3
    fname = 'model_0_acc_20_frames_random.pt'
    path = os.path.join(models_dir, fname)
    torch.save(model.state_dict(), path)
    print('Saved dummy model to:', path)

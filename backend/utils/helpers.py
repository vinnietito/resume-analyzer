import os
from werkzeug.utils import secure_filename

def allowed_file(filename, allowed_extensions):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in allowed_extensions

def save_file(file, upload_folder, user_id):
    filename = secure_filename(file.filename)
    filepath = os.path.join(upload_folder, f"{user_id}_{filename}")
    file.save(filepath)
    return filepath

def delete_file(filepath):
    if os.path.exists(filepath):
        os.remove(filepath)
        return True
    return False
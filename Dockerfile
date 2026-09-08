FROM python:3.14

ENV PYTHONDONOTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

COPY requirements.txt .

RUN pip install --upgrade pip
RUN pip install -r requirements.txt

COPY . .

# Keep a copy of the bundled media (e.g. default_img.jpg) to seed the /app/media volume on first run
RUN cp -r media /media_seed

EXPOSE 8000

# Seed the shared media volume from the image's bundled files on first run, then migrate + serve
CMD cp -rn /media_seed/. media/ && python manage.py migrate && python manage.py runserver 0.0.0.0:8000
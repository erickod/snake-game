# A multiplayer snake like game
A multiplayer game inspired in traditional snake game.


## How to run this project
Inside the directory that contains the requirements.txt and the pyproject.toml files, follow the instructions:

- ### If you use pip tool:
  ```pip install -r requirements.txt```

- ### If you use poetry:
  ```poetry shell```
  ```poetry install```

- ### If you use Linux or Mac, open a terminal and type the following to set your SECRET_KEY:
  ```export SECRET_KEY=<YOUR SECRET KEY HERE>```
- ### If you use Windows, open a promp and type the following to set your SECRET_KEY:
  ```set SECRET_KEY=<YOUR SECRET KEY HERE>```
- ### Execute Python Migrations
  ```python manage.py makemigrations core```
  ```python manage.py migrate```

- ### Run the server
  ```python server/server.py```

- ### Play the game
  - Open your browser on ```http://<your-ip-addres>:8080```



#!/bin/bash

source .venv/bin/activate
pip install -r requirements.txt --root-user-action=ignore

export POSTGRES_URL=postgresql+psycopg2://admin:strongpassword123@wms-postgres:5432/deliveroo
export SERVICE_NAME=wms-api
export PORT=3001
python src/run.py

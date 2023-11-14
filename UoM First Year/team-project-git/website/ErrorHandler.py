import csv
import traceback
from datetime import datetime
from flask import render_template,redirect
from functools import wraps

def HandleError(function):
        @wraps(function)
        def handler(*args,**kwargs):
            try:
                return function(*args,**kwargs)
            except Exception as e:
                ## gets traceback leading to error
                trace=traceback.format_exc()

                LogError(e,function.__name__,trace)

                
                return {"status":"error",
                         "error":"Internal Server Error"}
                
        return handler

def RedirectOnError(function):
        @wraps(function)
        def handler(*args,**kwargs):
            try:
                return function(*args,**kwargs)
            except Exception as e:
                ## gets traceback leading to error
                trace=traceback.format_exc()

                LogError(e,function.__name__,trace)

                return redirect("/errorpage")
                
        return handler


def LogError(e, funcname,trace):

    ## get time error occurred
    currenttime= datetime.now()
    currenttime=currenttime.strftime("%m/%d/%Y, %H:%M:%S")

    ## create dictionary storing error details
    errorlog= {"Date":currenttime,
               "Type":type(e).__name__,
               "Error":e,
               "Function":funcname,
               "Traceback":trace}
    print(errorlog)
    ## write error to error log csv file
    with open("error_log.csv",mode="a",newline='') as file:
        writer=csv.writer(file)
        writer.writerow(errorlog.values())


def AddHeaders():
    headers=["Date","Type","Error","Function","Trace"]
    with open("error_log.csv",mode="a",newline='') as file:
        writer=csv.writer(file)
        writer.writerow(headers)



def OutputErrorLog():
    ## returns list of all the rows in csv 
    rows=[]
    with open('error_log.csv', 'r') as file:
        reader = csv.reader(file)
        for row in reader:
            rows.append(row)
    return rows


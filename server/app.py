from flask import Flask, request, jsonify
from netCDF4 import Dataset
import numpy as np
from flask_cors import CORS
from time import sleep

app = Flask("name")
CORS(app)

def reshapeMap(lats, longs, var, min_lat, max_lat, min_long, max_long):

    lat_mask = (lats.data >= min_lat) & (lats.data <= max_lat)
    long_mask = (longs.data >= min_long) & (longs.data <= max_long)

    lats_cropped = lats[lat_mask]
    longs_cropped = longs[long_mask]
    var_cropped = var[lat_mask]

    new_array = np.zeros((len(lats_cropped),len(longs_cropped)))

    for i,line in enumerate(var_cropped):
        new_array[i] = line[long_mask]
    
    return new_array, lats_cropped, longs_cropped

def filter(threshold, var_name, bounderies, latName, lonName, dataType):

    if(dataType == "fire"):
        data = fireDataFile
    else:
        data = floodDataFile

    lastTry = True

    for i in range(10):
        try:
            var = data.variables[var_name][:].data
            lastTry = False
            break
        except:
            print("failed to read file, retrying")
            sleep(1)

    if lastTry and dataType == "fire":
        data = Dataset("fire.nc", mode='r')

    if(len(var.shape) > 2):
        var = np.squeeze(var)

    lats = data.variables[latName][:]
    longs = data.variables[lonName][:]

    if bounderies:
        if not "mnlat" in bounderies:
            bounderies["mnlat"] = min(lats.data)
        if not "mxlat" in bounderies:
            bounderies["mxlat"] = max(lats.data)
        if not "mnlong" in bounderies:
            bounderies["mnlong"] = min(longs.data)
        if not "mxlong" in bounderies:
            bounderies["mxlong"] = max(longs.data)
        print(bounderies)
        var, lats, longs = reshapeMap(lats, longs, var, bounderies["mnlat"],bounderies["mxlat"], bounderies["mnlong"], bounderies["mxlong"])

    mask = var > threshold

    masked_tave = np.where(mask, var, np.nan)  # Assuming you are interested in the first time step

    valid_indices = np.argwhere(~np.isnan(masked_tave))

    latitude_longitude_data = {
        f"{lats[i]}, {longs[j]}": f"{masked_tave[i, j]}"
        for i, j in valid_indices
    }

    return latitude_longitude_data


@app.route('/help', methods=['GET'])
def help():
    help_msg = """
    Welcome to EFCA: Emergency Filtering Coordinates API
    Endpoits:
    GET /emergencies: Will return the lat,long -> var_val of the '/data.nc' CDF4 dataset that are above the threshold
        Request Values(JSON):
        - threshold: value used to filter values(default = 10)
        - var: name of the variable in dataset(default = 'dis06')
        - max_long: maximun longitude for filtering 
        - min_long: minumun longitude for filtering
        - max_lat: maximun latitude for filtering
        - min_lat: minumun latitude for filtering
    """
    return help_msg

@app.route('/fire_emergencies', methods=['POST'])
def fire_emergencies():

    data = request.get_json()
    
    #Default values:
    threshold = 10
    var = "s3a_night_fire"
    bounderies = None

    if "threshold" in data:
        threshold = data["threshold"]
    if "var" in data:
        var = data["var"]
    if "max_long" in data or "min_long" in data or "max_lat" in data or "min_lat" in data:
        bounderies = {}
        if "max_long" in data:
            bounderies["mxlong"] = data["max_long"]
        if "min_long" in data:
            bounderies["mnlong"] = data["min_long"]
        if "max_lat" in data:
            bounderies["mxlat"] = data["max_lat"]
        if "min_lat" in data:
            bounderies["mnlat"] = data["min_lat"]
    

    return jsonify(filter(threshold, var, bounderies, 'lat', 'lon', "fire"))

@app.route('/flood_emergencies', methods=['POST'])
def flood_emergencies():

    data = request.get_json()

    #Default values:
    threshold = 10
    var = "vsw"
    bounderies = None

    if "threshold" in data:
        threshold = data["threshold"]
    if "var" in data:
        var = data["var"]
    if "max_long" in data or "min_long" in data or "max_lat" in data or "min_lat" in data:
        bounderies = {}
        if "max_long" in data:
            bounderies["mxlong"] = data["max_long"]
        if "min_long" in data:
            bounderies["mnlong"] = data["min_long"]
        if "max_lat" in data:
            bounderies["mxlat"] = data["max_lat"]
        if "min_lat" in data:
            bounderies["mnlat"] = data["min_lat"]


    return jsonify(filter(threshold, var, bounderies, 'latitude','longitude', "flood"))

@app.route('/slide_emergencies', methods=['POST'])
def slide_emergencies():



    data = request.get_json()

    #Default values:
    threshold = 10
    var = "s3a_night_fire"
    bounderies = None

    if "threshold" in data:
        threshold = data["threshold"]
    if "var" in data:
        var = data["var"]
    if "max_long" in data or "min_long" in data or "max_lat" in data or "min_lat" in data:
        bounderies = {}
        if "max_long" in data:
            bounderies["mxlong"] = data["max_long"]
        if "min_long" in data:
            bounderies["mnlong"] = data["min_long"]
        if "max_lat" in data:
            bounderies["mxlat"] = data["max_lat"]
        if "min_lat" in data:
            bounderies["mnlat"] = data["min_lat"]


    return jsonify(filter(threshold, var, bounderies, 'latitude','longitude', "fire"))

if __name__ == '__main__':
    file = 'soil.nc'
    floodDataFile = Dataset(file, mode='r')
    file = 'fire.nc'
    fireDataFile = Dataset(file, mode='r')
    app.run(host="0.0.0.0")

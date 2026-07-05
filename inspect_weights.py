import h5py

try:
    with h5py.File('backend/ModeloPredictivo.h5', 'r') as f:
        print("Groups in H5:")
        print(list(f.keys()))
        if 'model_weights' in f:
            print("Layer weights:")
            for layer_name in f['model_weights'].keys():
                if 'dense' in layer_name.lower():
                    print(layer_name, list(f['model_weights'][layer_name].keys()))
                    for weight_name in f['model_weights'][layer_name].keys():
                        print(weight_name, f['model_weights'][layer_name][weight_name].shape)
except Exception as e:
    print(f"Error: {e}")

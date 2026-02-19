import os

# function should and check multiple env vars
def assert_env_var(*var_names: str) -> None:
    for var_name in var_names:
        if not os.environ.get(var_name):
            raise ValueError(f"{var_name} is not set")

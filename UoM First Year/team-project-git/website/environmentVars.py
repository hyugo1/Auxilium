import os
import sys
import platform
import subprocess

# Stores USERNAME and PASSWORD securely in the keyring
PROJECT_NAME = "y9GroupProject_"

USERNAME_PATH = PROJECT_NAME + "Username"
PASSWORD_PATH = PROJECT_NAME + "Password"

HOST_NAME_PATH = PROJECT_NAME + "dbHost"
DATABASE_NAME_PATH = PROJECT_NAME + "dbName"

APP_KEY_PATH = PROJECT_NAME + "APP_KEY"
APP_SECRET_PATH = PROJECT_NAME  + "APP_SECRET"
REFRESH_TOKEN_PATH = PROJECT_NAME + "REFRESH_TOKEN"
ACCESS_CODE_PATH = PROJECT_NAME + "ACCESS_CODE"

def ReadEnvironmentVar(varName):
    try:
        return os.environ[varName]
    except KeyError:
        print(f"Environment variable '{varName}' not found.")
        return None

def SetEnvironmentVar(name, value):
    system = platform.system()

    if system == "Windows":
        try:
            # Add the environment variable to the Windows registry
            subprocess.run(["setx", name, value], check=True)
            print(f"Environment variable '{name}' set to '{value}' permanently.")
        except subprocess.CalledProcessError as e:
            print(f"Failed to set environment variable '{name}': {e}")
            return False

    elif system == "Linux" or system == "Darwin":  # Linux and macOS (Darwin)
        try:
            shell = os.environ.get("SHELL", "/bin/bash")
            shellConfig = os.path.expanduser("~/.bashrc") if "bash" in shell else os.path.expanduser("~/.zshrc")

            # Add the environment variable to the shell configuration file
            with open(shellConfig, "a") as config:
                config.write(f"\nexport {name}='{value}'\n")
                print(f"Environment variable '{name}' set to '{value}' permanently.")
                
        except Exception as e:
            print(f"Failed to set environment variable '{name}': {e}")
            return False

    else:
        print(f"Unsupported platform '{system}'.")
        return False

    return True

def main():
    # Example: Reading 'PATH' environment variable
    var_name = 'PATH'
    env_value = ReadEnvironmentVar(var_name)

    if env_value:
        print(f"{var_name} = {env_value}")


def SetAllVars():
    SetEnvironmentVar(USERNAME_PATH, "")
    SetEnvironmentVar(PASSWORD_PATH, "")

    SetEnvironmentVar(HOST_NAME_PATH, "")
    SetEnvironmentVar(DATABASE_NAME_PATH, "")

    SetEnvironmentVar(APP_KEY_PATH, "")
    SetEnvironmentVar(APP_SECRET_PATH, "")
    SetEnvironmentVar(REFRESH_TOKEN_PATH, "")
    SetEnvironmentVar(ACCESS_CODE_PATH, "")

# def SetAllVars():
#     SetEnvironmentVar(USERNAME_PATH, "t62839hs")
#     SetEnvironmentVar(PASSWORD_PATH, "Benthebaker4")

#     SetEnvironmentVar(HOST_NAME_PATH, "dbhost.cs.man.ac.uk")
#     SetEnvironmentVar(DATABASE_NAME_PATH, "2022_comp10120_y9")

# SetAllVars()

if __name__ == "__main__":
    pass
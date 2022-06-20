# Run MongoDB as a Service on macOS

To check to see if Homebrew is installed, run brew --version in your terminal window. If your terminal displays a version of Homebrew, you can move on to the installation guide. If you see an error message like command not found, run the following command in your terminal to install Homebrew:

```yaml
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Once you have confirmed that Homebrew is on your machine, move on to the installation guide.

To run MongoDB as a service on macOS, follow these steps:

Run the following command in your terminal:

```yaml
 brew services start mongodb-community@4.2
```

Verify that the service is running by using the following command:

```yaml
 ps aux | grep -v grep | grep mongod
```

If you don't see any output from the command above, try restarting the service by running the following command in your terminal:

```yaml
 brew services restart mongodb-community
```

Note: It’s possible that you may already have the MongoDB server running as a service on your computer. You might not have to run mongod in a separate terminal before initializing the Mongo shell. However, if you have trouble using the Mongo shell with the command mongo, try opening a new terminal and running the command mongod.

Initialize the Mongo Shell on macOS
To initialize the Mongo shell, open a new instance of your terminal and enter the following command:

```yaml
 mongo
```

This will initialize the Mongo shell and allow you to begin entering Mongo shell commands. Finally, bookmark this list of MongoDB shell commands for quick reference.

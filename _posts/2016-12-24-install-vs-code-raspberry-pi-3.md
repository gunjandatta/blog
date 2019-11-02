---
layout: "post"
title: "Install VS Code on Raspberry Pi 3"
date: "2016-12-24"
description: ""
feature_image: ""
tags: []
---

This blog post is a little outside SharePoint, which is generally what I tend to blog about. As a side project, I'm working w/ my daughter to build her class computer lab. I purchased 5 raspberry pi 3b kits and tried to follow Scott Hanselman's [blog post](http://www.hanselman.com/blog/BuildingVisualStudioCodeOnARaspberryPi3.aspx) on installing VS Code. Here are the latest steps that worked for me. The version of Raspbian is the latest Nov 2016 (Pixel).

<!--more-->

### Pre-Build Configuration

When we build the source code for VS Code, it will throw an error related to node-native-keymap. We will still need to install the supporting libraries first by running the following command:

```
sudo apt-get install libx11-dev

```

Next, we need to install the latest version of nodejs. I went w/ the 7.x branch:

```
curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -
sudo apt-get install nodejs

```

### Build VS Code

Now to compile the source code. From the home directory, I ran the following to get the latest source code:

```
mkdir projects && cd $_
git clone https://github.com/microsoft/vscode

```

To build the source code, run the following command:

```
cd ~/projects/vscode
./scripts/npm.sh install --arch=armhf

```

Run an instance of VS Code, by running the following command:

```
cd ~/projects/vscode
./scripts/code.sh

```

_Note - Running VS Code the first time will take some time, but will be faster afterwards._

### Create a Start Menu Shortcut

The last part is optional, but will be easier for the kids to run VS Code. Perform the following:

1) Start Menu -> Preferences -> Main Menu Editor 2) Click on "Programming" from the left menu 3) Click on "New Item" to add a new menu icon to the "Programming" menu 4) Set the Name as "VS Code" and Browse to the following location:

```
/home/pi/projects/vscode/scripts/code.sh

```

5) You can optional download a VS Code logo and set it as the logo for the menu item. I downloaded this [logo](http://icons.duckduckgo.com/ip2/www.visualstudio.com.ico).

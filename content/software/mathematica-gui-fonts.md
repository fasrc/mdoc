Title: Mathematica GUI Fonts
Date: 2015-11-10
Category: software
Tags: Odyssey, Mathematica
Summary: Using Mathematica on Odyssey.

The Mathematica GUI requires its own set on fonts to run correctly when used on Odyssey. To be able to run an Interactive, GUI session/job, there are a few steps that will need to be taken. This goes for sessions over SSH, as well as NX sessions.

## OS X/Linux Systems

OS X and Linux systems are the simplest to set up. Linux has X natively, which is what needs the specific Mathematica fonts. OS X versions after 10.7 should install the [XQuartz](https://xquartz.macosforge.org/landing/) package which replaces the native X11 app which shipped with earlier versions of OS X. 

Create a directory to hold the fonts:

    :::bash
    mkdir ~/mathfonts
    cd ~/mathfonts

Download the fonts archive:

    :::bash
    wget http://rcc.its.psu.edu/hpc/software/mathematica/mathematica-fonts.tgz

Extract the fonts:

    :::bash
    tar -xzvf mathematica-fonts.tgz
    rm mathematica-fonts.tgz

The fonts are now installed, but you must tell the X server to use them. This will need to be before you connect to Odyssey, each time you wish to connect to run Mathematica. For this reason, you may want to add it to your local (not Odyssey) .bashrc/.tcshrc. The fonts must be added to the X server in a particular order:

*NOTE: /full/path/to/fonts/ below is a placeholder for the full path to the newly installed fonts. You will need to replace it with the path where you've just installed the fonts. You can derive this by typing `pwd` while you're still in ~/mathfonts.*

    :::bash
    xset fp+ /full/path/to/fonts/Type1
    xset fp+ /full/path/to/fonts/BDF
    xset fp rehash

You may now login to Odyssey as normal, load the Mathematica module, and work as normal.  


## Windows Instructions

Windows Instructions are very similar, only you will be operating inside your Cygwin/Xming environment. Cygwin/Xming needs to be installed, with an Xserver, and that XServer should be running. For more information, please see: http://x.cygwin.com/docs/ug/cygwin-x-ug.html With Cygwin/Xming running, perform the following: 


Create a directory to hold the fonts:

    :::bash
    mkdir ~/mathfonts
    cd ~/mathfonts

Download the fonts archive:

    :::bash
    wget http://rcc.its.psu.edu/hpc/software/mathematica/mathematica-fonts.tgz

Extract the fonts:

    :::bash
    tar -xzvf mathematica-fonts.tgz
    rm mathematica-fonts.tgz

The fonts are now installed, but you must tell the X server to use them. This will need to be before you connect to Odyssey, each time you wish to connect to run Mathematica. For this reason, you may want to add it to your local (not Odyssey) .bashrc/.tcshrc. 

*The fonts must be in a path without spaces/special characters, otherwise the XServer will fail to find them. Many times Cygwin will have spaces in your users home directory. If this is the case, you may want to move the fonts outside that directory,such as `/mathfonts`.*


*NOTE: /full/path/to/fonts/ below is a placeholder for the full path to the newly installed fonts. You will need to replace it with the path where you've just installed the fonts. You can derive this by typing _pwd_ while you're still in ~/mathfonts.* 

The fonts must be added to the X server in a particular order:

    :::bash
    xset fp+ /full/path/to/fonts/Type1
    xset fp+ /full/path/to/fonts/BDF
    xset fp rehash

You may now login to Odyssey as normal, load the Mathematica module, and work as normal. 

_We are grateful for assistance from the [Pennsylvania State University HPC group](http://rcc.its.psu.edu/hpc/) in helping with this solution._
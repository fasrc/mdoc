Title: Access and Login
Date: 2015-11-10
Category: Guides
Tags: Odyssey, access
Summary: This guide will provide you with details about how to access the Odyssey system, including ssh, directory mounts, and NX.

### Odyssey access requires an RC account

Odyssey resources (storage, software downloads, special workstations, instrumentation scheduling, etc.) can be accessed through a number of paths (see below), but all require an RC account. An account can be requested through the [account request web application](https://account.rc.fas.harvard.edu/request/). On the "Services" page, select Odyssey Cluster Use. [![Account request page](/wp-content/uploads/2014/02/account_request_user_info.png)](/wp-content/uploads/2014/02/account_request_user_info.png) [caption id="" align="alignnone" width="1316"][![Check Odyssey Cluster Use to access Odyssey resources](/wp-content/uploads/2014/02/account_request_odyssey_check.png)](/wp-content/uploads/2014/02/account_request_odyssey_check.png) Check Odyssey Cluster Use to access Odyssey resources[/caption] We aim to generate accounts inside ONE business day. Some times there are external factors that may increase or delay this turn around. For example your PI may not available to approve your status, there is a technical issue in validating your status, or other issues beyond our control. If you don't hear from us inside one business day and you are sure your PI has approved the account, please feel free to escalate directly to our operations manager [Brian White](mailto:brian_white@harvard.edu) so he can investigate. The password that you've set in the account request application will be the password you use to access Odyssey resources. If you later forget the password, you can reset it using the [password reset application](https://account.rc.fas.harvard.edu/password_reset/). **NOTE!** You are required to attend the [Introduction to Odyssey course](https://rc.fas.harvard.edu/education/training/intro-to-odyssey/) within 45 days of your account issue; otherwise your account will automatically expire.

### Odyssey access requires the OpenAuth tool for two factor authentication

Unless you're only interested in using the [SPINAL scheduling software](/services/instrument-sign-up/), logins to Odyssey resources use a two factor authentication scheme that is supported by the OpenAuth tool. The installation of the OpenAuth tool is a two step process that starts at the [RC software page](https://software.rc.fas.harvard.edu/oa/) and ends with an email that allows you to download your personalized copy. This link will prompt you for your Harvard FAS Research Computing username and password and send an email with your personalized download link. Since the site uses email verification to authenticate you, you must also have a valid email address on record with us. All OpenAuth tokens are software-based, and you will choose whether to use a smart phone or java desktop app to generate your verification codes. Java 1.6 is required for the desktop app. You must close your browser in order to logout of the site when you’re done. Once installed, the OpenAuth tool is a small Java application window that provides a time-limited verification code. This is used whenever you are prompted for a "Verification code" or a second password. [![Logging in to Odyssey using two-factor authentication. The OpenAuth application (upper right corner) displays the value to be used for the Verification code prompt.](/wp-content/uploads/2014/02/OpenAuth-verification-code.png)](/wp-content/uploads/2014/02/OpenAuth-verification-code.png) Once you complete the quick steps in the above site, you’ll be all set to use OpenAuth. You may also revisit that site in order to setup your token on an additional device (you’ll still be able to use your original device, too). For those using OS X, you might want to download and install the [OTP Token Paster for OS X](https://github.com/jwm/os-x-otp-token-paster). This service enters the current one-time password (OTP) into the current iTerm window using a hotkey. Please keep in mind the [revoke](https://software.rc.fas.harvard.edu/oa/revoke) link if you ever lose the device with your token or otherwise insecurely handle your token and need to start over with a new one. For troubleshooting issues you might have, please see our [troubleshooting page](https://rc.fas.harvard.edu/resources/documentation/openauth/troubleshooting/).

#### SPINAL access does not require two-factor authentication

If you are using your RC account mainly for access to the SPINAL instrument scheduling software, the VPN and OpenAuth installations described above are not required.

#### Download VPN and install VPN software appropriate for your computer

Odyssey resources must be accessed through a virtual private network software (VPN) for any off-campus connections. A VPN ensures that all communication between your computer and RC resources is encrypted even when using a public wireless network. See the [VPN page](/resources/vpn-setup) for software download and setup instructions.

### Use common terminal application for command line access

If you're using a Mac, the built-in Terminal application (in Applications->Utilities) is very good, though there are replacements available (e.g. [iTerm2](http://www.iterm2.com/#/section/home)). After starting a Terminal session, use the `ssh` command to login to Odyssey.

<div class="rc-code">$ ssh akitzmiller@login.rc.fas.harvard.edu</div>

_To avoid login issues, always supply your username in the ssh connection as above, since omitting this will cause your local login name at your terminal to be passed to the login nodes._ If you're using a Windows PC, [Putty](http://www.chiark.greenend.org.uk/~sgtatham/putty/download.html) is a commonly used terminal tool. After a very simple download and install process, just run putty and enter `login.rc.fas.harvard.edu` in the Host Name box. [![Configuration window for Putty sessions](/wp-content/uploads/2014/02/putty_configuration_windows.png)](/wp-content/uploads/2014/02/putty_configuration_windows.png) Just click the Open button and you will get the familiar password and verification code prompts. [![ssh connection to Odyssey via Putty](/wp-content/uploads/2014/02/putty_connection.png)](/wp-content/uploads/2014/02/putty_connection.png) Once you've logged in successfully, see below for instructions about how to run jobs. HUIT (Harvard IT) also provides downloads for SecureCRT and SecureFX, a terminal and file transfer tool respectively, but users have recently reported difficulties with both. If you'd like to try them. go to the [HUIT download page](http://downloads.fas.harvard.edu) (you'll need your Harvard PIN) and download either or both of these tools.

### Setup X11 forwarding for lightweight graphical applications

Many graphical applications can be run from Odyssey with a combination of terminal X11 forwarding and an X Windows server. For Macs, the [XQuartz](https://xquartz.macosforge.org/landing/) X Windows server package is the currently recommended install. For Windows, [Xming](http://www.straightrunning.com/XmingNotes/) is a good choice. Both are free. NOTE: Another X Windows client for Windows called MobaXterm has started to gain users. Please be aware that you may need to use its _Tools_ ->  _MobApt packages manager_ to install additional components before some X applications will work. You will _almost definitely_ need to install _xset_ before using any GUI apps (Mathematica, etc.) on Odyssey. See MobaXterm's Help documentation for more. After installation, run the X Windows server application, and then connect with X11 forwarding enabled. From an X window on Mac or Linux, add the -Y option to the ssh command. Example:

<div class="rc-code">$ ssh -Y akitzmiller@login.rc.fas.harvard.edu</div>

For PCs using Putty, make sure and check the X11 forwarding box under Connection -> SSH -> X11 [![X11 forwarding in Putty](/wp-content/uploads/2014/02/putty_x11_forwarding.png)](/wp-content/uploads/2014/02/putty_x11_forwarding.png) After you've connected, to run a graphical application ([Mathematica requires additional setup](https://rc.fas.harvard.edu/resources/documentation/software/mathematica-gui-fonts/)), you'll need to run an X11 friendly job in the interactive partition (see [Running Jobs](/resources/running-jobs)).

### Consider an NX remote desktop for graphical applications like Matlab and RStudio.

Many graphical applications will run fine with the X11 forwarding steps described above, especially if you are connected to the campus network. However, X11 is a very old protocol designed for local physical networks and so can become very slow when wireless signal is poor or when accessed from home. Also, when you disconnect from the network, there is no way to "suspend" your graphical session for later use. The rcnx01 and holynx01 servers host remote desktops served by the NoMachine NX system. Like Windows RDP and [VNC](http://en.wikipedia.org/wiki/Virtual_Network_Computing), NX allows you to connect to a desktop that is running on a remote server. The network performance makes graphical applications much more responsive. And because it is running on a server, you can disconnect from the desktop (suspend) and reconnect later.

#### NX connection and usage

**Note:** You will need to install the noMachine client to use NX. The NX/noMachine software can be downloaded from the [NX download site](http://www.nomachine.com/product&p=NoMachine%20Enterprise%20Client) for all OSes. These screen shots show NX on a Mac. PC software is very similar and the same choices should be made.

1.  _Make sure you are connected to the **RC VPN (vpn.rc.fas.harvard.edu)**_ The `rcnx01` and `holynx01` servers are not accessible from outside of the RC VPN. In particular, you cannot access them from the FAS VPN (vpn.fas.harvard.edu). If you're unsure how to connect to our VPN, see [VPN Setup](/resources/vpn-setup/)

[![Use the RC VPN when connecting to Odyssey resources. This is distinct from the FAS VPN (vpn.fas.harvard.edu).](https://rc.fas.harvard.edu/wp-content/uploads/2014/06/Connect-to-RC-VPN.png)](https://rc.fas.harvard.edu/wp-content/uploads/2014/06/Connect-to-RC-VPN.png)

1.  _Add a new computer_ Setup the connection by first clicking on the "Add Computer" button. The example images below use `rcnx01`, but both rcnx01 and holynx01 are available for use.

[![Select 'Add a computer' to enter a new server name.](/wp-content/uploads/2014/02/nx-add-a-computer.png)](/wp-content/uploads/2014/02/nx-add-a-computer.png) Then enter the correct connection information. Use the SSH protocol and port 22 and specify the full name of the machine `rcnx01.rc.fas.harvard.edu` or `holynx01.rc.fas.harvard.edu` [![Use these settings to connect to rcnx01 or holynx01 Name: rcnx Protocol: SSH Host: rcnx01 or holynx01 followed by .rc.fas.harvard.edu Port: 22](/wp-content/uploads/2014/02/nx-ssh-port-22-to-rcnx01.png)](/wp-content/uploads/2014/02/nx-ssh-port-22-to-rcnx01.png)

1.  _Click the "Advanced" button on the connection page (see previous screenshot) and specify "No Machine Login"_

[![For Macs, use the NoMachine login](/wp-content/uploads/2014/02/nx-use-nomachine-login.png)](/wp-content/uploads/2014/02/nx-use-nomachine-login.png)

1.  _Click Continue then "Yes" if you get the authenticity warning_ This will only happen the first time you connect.

[![Click yes to verify authenticity.](/wp-content/uploads/2014/02/nx-ok-to-accept.png)](/wp-content/uploads/2014/02/nx-ok-to-accept.png)

1.  _Select a new session_ If you have previously suspended sessions, they will be listed here.

[![Select a new or existing session.](/wp-content/uploads/2014/02/nx-new-virtual-desktop-or-choose-a-preexisting-session.png)](/wp-content/uploads/2014/02/nx-new-virtual-desktop-or-choose-a-preexisting-session.png)

1.  _Select "GNOME desktop" and check Save Configuration_ The other types of desktops listed here are not supported on rcnx01 or holynx01

[![Select a GNOME virtual desktop](/wp-content/uploads/2014/02/nx-gnome-desktop-and-select-save-config.png)](/wp-content/uploads/2014/02/nx-gnome-desktop-and-select-save-config.png)

1.  _Start a Terminal after the desktop appears_ It should only take a moment before the standard Gnome desktop appears. Once it appears, you'll want to start a terminal so that any tools you use can be run from an Odyssey interactive session.

[![Starting a terminal on an NX Gnome desktop](/wp-content/uploads/2014/02/nx-start-terminal.png)](/wp-content/uploads/2014/02/nx-start-terminal.png)

1.  _Run an interactive session_ `rcnx01` and `holynx01` are much like the Odyssey login nodes; all NX users connect to this machine initially. Therefore, if you run calculations there, it will significantly degrade performance for every one. Use `srun` to start an interactive session, like that shown here, for 6 hrs with 4 GB RAM and 1 core on 1 node e.g.

<div class="rc-code">srun --pty --x11=first --mem 4000 -p interact -t 0-6:00 -n 1 -N 1 /bin/bash</div>

and then load the appropriate modules. [![Run an interactive session before starting your application.](/wp-content/uploads/2014/02/nx-run-interactive-job.png)](/wp-content/uploads/2014/02/nx-run-interactive-job.png)

1.  _Run your software_ Finally, run the software with the appropriate command.

[![NX desktop running RStudio](/wp-content/uploads/2014/02/nx-running-rstudio.png)](/wp-content/uploads/2014/02/nx-running-rstudio.png)

1.  _Suspend or Terminate when finished_ NX desktops can be suspended if, for example, you have to disconnect to go home and would like to resume when you get back. Just click on the window close control (for Macs, the red dot in the upper left corner of the window). You'll be prompted to Suspend or Terminate. If you select Suspend, you'll have the option to reconnect the next time you start an NX session.

[![Suspend or terminate your desktop session.](/wp-content/uploads/2014/02/nx-suspend-or-terminate.png)](/wp-content/uploads/2014/02/nx-suspend-or-terminate.png)

### Mounting Odyssey storage, like home directories and lab shares, on your desktop

In addition to connecting to Odyssey servers and launching compute jobs, many scientists use Odyssey file systems for storage of lab data. These file systems can be mounted on your desktop to simplify data transfer. Odyssey file systems are shared via the Windows SMB protocol so this process is straightforward(ish).

1.  _Connect to the VPN if on wireless, or wired connections outside of Harvard_ If using wireless connections, Odyssey storage **must** be routed through a VPN connection. If on wired connections inside Harvard, the VPN client is not required. If you don't already have one setup, follow the [Odyssey VPN setup instructions](/resources/vpn-setup/).
2.  _Find out the name of the filesystem you want to mount_ You can figure this out by using ssh to login to Odyssey. Use `cd` to go to the directory you wish to mount on your machine and type `df -h .` (note the . character at the end of the command). If it's your home directory, `cd ~` will work.

    <div class="rc-code">[dsulivan@rclogin05 ~]$ cd ~ [dsulivan@rclogin05 ~]$ df -h . Filesystem Size Used Avail Use% Mounted on rcstore:/ifs/rc_homes/home08 4.0T 8.5G 4.0T 1% /n/home08/</div>

    The server name is the word before “:”, in the case above, `rcstore`. The share name is the name after `/ifs/rc_homes`. In the case above it is `home08`. The path that will be need for connecting is the combination of the servername, the word `homes`, the share name, and your username. For the example, this will be: `\\rcstore.rc.fas.harvard.edu\homes\home08\dsulivan` All the instructions below use these values in the examples. You will need to substitute `dsulivan`, `rcstore`, and `home08` with the values applicable to you. 3\. _Macs use Connect to Server_ If you're using a Mac, go to a Finder window (or click on the desktop) and choose Go > Connect to Server from the menu. [![Mac Connect to Server](/wp-content/uploads/2014/02/mac-connect-to-server.png)](/wp-content/uploads/2014/02/mac-connect-to-server.png) In the server address box, enter the server and path combination described above prepended with the `smb://` protocol specifier. Using the example information above, the value would be `smb://rcstore.rc.fas.harvard.edu/homes/home08/dsulivan` to mount the home directory of the `dsulivan` user. [![Mount home directory on a Mac](/wp-content/uploads/2014/05/mac-mount-home-dir.png)](/wp-content/uploads/2014/05/mac-mount-home-dir.png) If you've selected the proper volume, you should get a login prompt. Use your Odyssey credentials here. Note that you must include the `rc\` domain specifier at the beginning of your user name. [![Use your Odyssey credentials to connect. Don't forget the `rc\`.](/wp-content/uploads/2014/05/mac-smb-login.png)](/wp-content/uploads/2014/05/mac-smb-login.png)
3.  _PCs use Map Network Drive_ You can connect to storage on a PC by using the Map Network Drive control panel application. This should be available from a Windows Explorer window.[![Access Map Network Drive from the "Computer" menu on Windows Explorer.](/wp-content/uploads/2014/02/windows8-explorer-computer.png)](/wp-content/uploads/2014/02/windows8-explorer-computer.png)In the Map Network Drive utility, select a drive letter, then enter the combination of share and path. For the example described above, the correct entry would be `\\rcstore.rc.fas.harvard.edu\homes\home08\dsulivan`It is important to select the _Connect using different credentials_ box. Usually, PC logins are not the same as Odyssey usernames and passwords. If you don't select this checkbox, it will attempt to login with your PC information and may result in a lockout. Also, make sure you are connected through the VPN if on wireless or off-campus -- this connection cannot be made outside of the VPN with these connection types/locations.[![Windows 8 Map Network Drive. Note that "Connect using different credentials" should be checked.](/wp-content/uploads/2014/05/windows8-map-network-drive.png)](/wp-content/uploads/2014/05/windows8-map-network-drive.png)When you are prompted for a login, make sure and prepend the `rc\` domain to your username.[![Login to Odyssey storage using rc domain credentials.](/wp-content/uploads/2014/05/windows8-network-credentials.png)](/wp-content/uploads/2014/05/windows8-network-credentials.png)
4.  _Linux using a terminal window_ You can connect to storage on a Linux system by using the desktop GUI or from the command line. In a terminal window, enter the following commands:

    * * *

    `mkdir /mnt/odyssey mount -t cifs -o workgroup=rc,username=dsulivan //rcstore.rc.fas.harvard.edu/homes/home08/dsulivan /mnt/odyssey`

    * * *

    This will prompt you for your password. If instead you get an error message about a read-only filesystem, it could be because the `mount.cifs` command is not installed on your system.Using this method, you will need to reissue the command every time you boot your computer.

*[lastupdated]*
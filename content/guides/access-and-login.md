Title: Access and Login
Date: 2015-11-10
Category: guides
Tags: Odyssey, Access
Summary: This guide will provide you with details about how to access the Odyssey system, including ssh, directory mounts, and NX.

### Odyssey access requires an RC account

Odyssey resources (storage, software downloads, special workstations, instrumentation scheduling, etc.) can be accessed through a number of paths (see below), but all require an RC account. An account can be requested through the [account request web application](account_request>). 

<figure>
	<a class="img" href="/images/account-sign-up-first-page.png">
    		<img class="img-temp" src="/images/account-sign-up-first-page.png"></img>
	</a>
    <figcaption>Account request page.</figcaption>
</figure>

On the "Services" page, select Odyssey Cluster Use. 


<figure>
	<a class="img" href="/images/account-sign-up-cluster-use.png">
    		<img class="img-temp" src="/images/account-sign-up-cluster-use.png"></img>
	</a>
    <figcaption>Select Odyssey Cluster Use to get an Odyssey account.</figcaption>
</figure>


We aim to generate accounts inside ONE business day. Sometimes there are external factors that may increase or delay this turn around. For example your PI may not available to approve your status, there is a technical issue in validating your status, or other issues beyond our control. If you don't hear from us inside one business day and you are sure your PI has approved the account, please feel free to escalate directly to our operations manager [Brian White](mailto:brian_white@harvard.edu) so he can investigate. The password that you've set in the account request application will be the password you use to access Odyssey resources. If you later forget the password, you can reset it using the [password reset application](password_reset>). 

**NOTE! You are required to attend the [Introduction to Odyssey course](https://rc.fas.harvard.edu/education/training/intro-to-odyssey/) within 45 days of your account issue; otherwise your account will automatically expire.** 

### Odyssey access requires the OpenAuth tool for two factor authentication

Unless you're only interested in using the [SPINAL scheduling software](/services/instrument-sign-up/), logins to Odyssey resources use a two factor authentication scheme that is supported by the OpenAuth tool. The installation of the OpenAuth tool is a two step process that starts at the [RC software page](openauth>) and ends with an email that allows you to download your personalized copy. This link will prompt you for your Harvard FAS Research Computing username and password and send an email with your personalized download link. Since the site uses email verification to authenticate you, you must also have a valid email address on record with us. 

All OpenAuth tokens are software-based, and you will choose whether to use a smart phone or java desktop app to generate your verification codes. Java 1.6 is required for the desktop app. You must close your browser in order to logout of the site when you’re done. Once installed, the OpenAuth tool is a small Java application window that provides a time-limited verification code. This is used whenever you are prompted for a "Verification code" or a second password. 


<figure>
	<a class="img" href="/images/OpenAuth-verification-code.png">
    		<img class="img-temp" src="/images/OpenAuth-verification-code.png"></img>
	</a>
    <figcaption>Logging in to Odyssey using two-factor authentication. The OpenAuth application (upper right corner) displays the value to be used for the Verification code prompt.</figcaption>
</figure>


Once you complete the quick steps in the above site, you’ll be all set to use OpenAuth. You may also revisit that site in order to setup your token on an additional device (you’ll still be able to use your original device, too). 


For those using OS X, you might want to download and install the [OTP Token Paster for OS X](https://github.com/jwm/os-x-otp-token-paster). This service enters the current one-time password (OTP) into the current iTerm window using a hotkey. 


Please keep in mind the [revoke](revoke>) link if you ever lose the device with your token or otherwise insecurely handle your token and need to start over with a new one. For troubleshooting issues you might have, please see our [troubleshooting page](https://rc.fas.harvard.edu/resources/documentation/openauth/troubleshooting/).

#### SPINAL access does not require two-factor authentication

If you are using your RC account mainly for access to the SPINAL instrument scheduling software, the VPN and OpenAuth installations described above are not required.

#### Download VPN and install VPN software appropriate for your computer

Odyssey resources must be accessed through a virtual private network software (VPN) for any off-campus connections. A VPN ensures that all communication between your computer and RC resources is encrypted even when using a public wireless network. See the [VPN page](/resources/vpn-setup) for software download and setup instructions.

### Use common terminal application for command line access

If you're using a Mac, the built-in Terminal application (in Applications->Utilities) is very good, though there are replacements available (e.g. [iTerm2](http://www.iterm2.com/#/section/home)). After starting a Terminal session, use the `ssh` command to login to Odyssey.

    :::shell-session
    $ ssh akitzmiller@odyssey.rc.fas.harvard.edu

_To avoid login issues, always supply your username in the ssh connection as above, since omitting this will cause your local login name at your terminal to be passed to the login nodes._ 


If you're using a Windows PC, [Putty](http://www.chiark.greenend.org.uk/~sgtatham/putty/download.html) is a commonly used terminal tool. After a very simple download and install process, just run putty and enter `odyssey.rc.fas.harvard.edu` in the Host Name box. 


<figure>
	<a class="img" href="/images/windows-putty-configuration.png">
    		<img class="img-temp" src="/images/windows-putty-configuration.png"></img>
	</a>
    <figcaption>Configuration window for Putty sessions.</figcaption>
</figure>


Just click the Open button and you will get the familiar password and verification code prompts. 


<figure>
	<a class="img" href="/images/windows-putty-session.png">
    		<img class="img-temp" src="/images/windows-putty-session.png"></img>
	</a>
    <figcaption>ssh connection to Odyssey via Putty.</figcaption>
</figure>


Once you've logged in successfully, see below for instructions about how to run jobs. HUIT (Harvard IT) also provides downloads for SecureCRT and SecureFX, a terminal and file transfer tool respectively, but users have recently reported difficulties with both. If you'd like to try them. go to the [HUIT download page](http://downloads.fas.harvard.edu) (you'll need your Harvard PIN) and download either or both of these tools.

### Setup X11 forwarding for lightweight graphical applications

Many graphical applications can be run from Odyssey with a combination of terminal X11 forwarding and an X Windows server. For Macs, the [XQuartz](https://xquartz.macosforge.org/landing/) X Windows server package is the currently recommended install. For Windows, [Xming](http://www.straightrunning.com/XmingNotes/) is a good choice. Both are free. 

**NOTE: Another X Windows client for Windows called MobaXterm has started to gain users. Please be aware that you may need to use its _Tools_ ->  _MobApt packages manager_ to install additional components before some X applications will work. You will _almost definitely_ need to install _xset_ before using any GUI apps (Mathematica, etc.) on Odyssey. See MobaXterm's Help documentation for more. **

After installation, run the X Windows server application, and then connect with X11 forwarding enabled. From an X window on Mac or Linux, add the -Y option to the ssh command. Example:

    :::shell-session
    $ ssh -Y akitzmiller@odyssey.rc.fas.harvard.edu

For PCs using Putty, make sure and check the X11 forwarding box under Connection -> SSH -> X11 


<figure>
	<a class="img" href="/images/windows-putty-x11-forwarding.png">
    		<img class="img-temp" src="/images/windows-putty-x11-forwarding.png"></img>
	</a>
    <figcaption>X11 forwarding in Putty.</figcaption>
</figure>


After you've connected, to run a graphical application ([Mathematica requires additional setup](https://rc.fas.harvard.edu/resources/documentation/software/mathematica-gui-fonts/)), you'll need to run an X11 friendly job in the interactive partition (see [Running Jobs](/resources/running-jobs)).

### Consider an NX remote desktop for graphical applications like Matlab and RStudio.

Many graphical applications will run fine with the X11 forwarding steps described above, especially if you are connected to the campus network. However, X11 is a very old protocol designed for local physical networks and so can become very slow when wireless signal is poor or when accessed from home. Also, when you disconnect from the network, there is no way to "suspend" your graphical session for later use. The rcnx01 and holynx01 servers host remote desktops served by the NoMachine NX system. Like Windows RDP and [VNC](http://en.wikipedia.org/wiki/Virtual_Network_Computing), NX allows you to connect to a desktop that is running on a remote server. The network performance makes graphical applications much more responsive. And because it is running on a server, you can disconnect from the desktop (suspend) and reconnect later.

#### NX connection and usage

You will need to install the noMachine client to use NX. The NX/noMachine software can be downloaded from the [NX download site](http://www.nomachine.com/product&p=NoMachine%20Enterprise%20Client) for all OSes. 

**NOTE: The default, free client for NX obtained when going to the download page will not work correctly with the Odyssey NX servers.  The Enterprise Client available from the link above is the best choice.**
<figure>
	<a class="img" href="/images/nx-client-download.png">
    		<img class="img-temp" src="/images/nx-client-download.png"></img>
	</a>
    <figcaption>Enterprise NX client download (Mac).</figcaption>
</figure>



These screen shots show NX on a Mac. PC software is very similar and the same choices should be made.

1.  ***Make sure you are connected to the RC VPN (vpn.rc.fas.harvard.edu)***<br/> 
    The rcnx01 and holynx01 servers are not accessible from outside of the RC VPN. In particular, you cannot access them from the FAS VPN (vpn.fas.harvard.edu). If you're unsure how to connect to our VPN, see [VPN Setup](/resources/vpn-setup/)
    <figure>
	    <a class="img" href="/images/connect-to-rc-vpn.png">
    		    <img class="img-temp" src="/images/connect-to-rc-vpn.png"></img>
	    </a>
        <figcaption>Use the RC VPN when connecting to Odyssey resources. This is distinct from the FAS VPN (vpn.fas.harvard.edu).</figcaption>
    </figure>

1.  ***Add a new connection***<br/>
       After starting the NoMachine client software, you should begin in the new connection wizard.  Setup the connection by first clicking on the "Click here to create a connection" link or the "New" button. The example images below use holynx01, but both rcnx01 and holynx01 are available for use.
    <figure>
        <a class="img" href="/images/nx-create-connection.png">
            <img class="img-temp" src="/images/nx-create-connection.png"></img>
        </a>
        <figcaption>Create a new connection.</figcaption>
    </figure>
        
1.  ***Select the SSH protocol***<br/>
    The SSH protocol should be chosen, not NX.
    <figure>
    		<a class="img" href="/images/nx-new-connection-ssh-protocol.png">
    			<img class="img-temp" src="/images/nx-new-connection-ssh-protocol.png"></img>
		</a>
	    <figcaption>Choose the SSH protocol.</figcaption>
    </figure>

1.  ***Specify the hostname***<br/>
    This should be rcnx01 or holynx01.  If you have never connected to either machine before, you may be prompted to verify the authenticity of the server..    <figure>
    		<a class="img" href="/images/nx-new-connection-hostname.png">
    			<img class="img-temp" src="/images/nx-new-connection-hostname.png"></img>
		</a>
	    <figcaption>Set the hostname to holynx01 or rcnx01.</figcaption>
    </figure>

1.  ***Use the NoMachine login***<br/>
    When prompted, select the "Use the NoMachine login" rather that the system login..    <figure>
    		<a class="img" href="/images/nx-new-connection-nomachine-login.png">
    			<img class="img-temp" src="/images/nx-new-connection-nomachine-login.png"></img>
		</a>
	    <figcaption>Choose the NoMachine login.</figcaption>
    </figure>


1.  ***Don't use a proxy***<br/> 
    No proxy is needed to access the NX head nodes when connected via RC VPN.1    <figure>
    		<a class="img" href="/images/nx-new-connection-dont-use-a-proxy.png">
    			<img class="img-temp" src="/images/nx-new-connection-dont-use-a-proxy.png"></img>
		</a>
	    <figcaption>Don't use a proxy.</figcaption>
    </figure>


1.  ***Give the connection a name***<br/>
    This name will be used to identify the connection on your NX dashboard.
    <figure>
    		<a class="img" href="/images/nx-new-connection-connection-name.png">
    			<img class="img-temp" src="/images/nx-new-connection-connection-name.png"></img>
		</a>
	    <figcaption>Choose a connection name.</figcaption>
    </figure>


1.  ***Select your new connection***<br/> 
    Once the connection is setup, you can choose it from the dashboard to start a new session.
    <figure>
    		<a class="img" href="/images/nx-select-connection.png">
    			<img class="img-temp" src="/images/nx-select-connection.png"></img>
		</a>
	    <figcaption>Select your new connection.</figcaption>
    </figure>


1.  ***Login using your RC credentials***<br/>
    After selecting your connection, you will be prompted for login credentials.  This should be your RC login; no @odyssey is necessary.
    <figure>
    		<a class="img" href="/images/nx-connection-login.png">
    			<img class="img-temp" src="/images/nx-connection-login.png"></img>
		</a>
	    <figcaption>Login using your RC credentials.</figcaption>
    </figure>


1.  ***Create a new desktop***<br/>
    Once you've logged in, you'll have the option to create a new desktop.  Only Gnome desktops are supported by the Odyssey NX login nodes.
    <figure>
    		<a class="img" href="/images/nx-create-new-desktop.png">
    			<img class="img-temp" src="/images/nx-create-new-desktop.png"></img>
		</a>
	    <figcaption>Create a Gnome desktop.</figcaption>
    </figure>

1.  ***Read or skip through the connection message panels***<br/>
    The NX session wizard will present you with a number of informational panels when you first setup a session.  You can read these, or skip through them.  Check the "Don't show this message again" boxes to avoid these in the future.
    <figure>
    		<a class="img" href="/images/nx-connection-messages.png">
    			<img class="img-temp" src="/images/nx-connection-messages.png"></img>
		</a>
	    <figcaption>Optional connection messages.</figcaption>
    </figure>

1.  ***The top left corner of your new desktop allows you to access a menu panel***<br/>
    If you mouse over the top left corner of the desktop and click on the 'curled' image, you'll reveal a menu panel with a number of NX options.  One of the most useful is the display panel that allows you to force the desktop to change with the size of the window.
    <figure>
    		<a class="img" href="/images/nx-top-left-corner.png">
    			<img class="img-temp" src="/images/nx-top-left-corner.png"></img>
		</a>
	    <figcaption>Mouse over the top left corner.</figcaption>
    </figure>
    <figure>
    		<a class="img" href="/images/nx-menu-panel.png">
    			<img class="img-temp" src="/images/nx-menu-panel.png"></img>
		</a>
	    <figcaption>Menu panel.</figcaption>
    </figure>
    <figure>
    		<a class="img" href="/images/nx-fit-to-window.png">
    			<img class="img-temp" src="/images/nx-fit-to-window.png"></img>
		</a>
	    <figcaption>Fit desktop size to the size of your current window.</figcaption>
    </figure>

1.  ***Use an interactive session***<br/>
    When you've connected to holynx01 or rcnx01, you should treat them like any other login node.  ***Software should not be run directly on NX login nodes***.  Use srun [as described in the interactive session section of the Running Jobs page]() to setup an interactive session.  For graphical work, don't forget the `--x11=first` srun option.
    <figure>
    		<a class="img" href="/images/nx-interactive-session.png">
    			<img class="img-temp" src="/images/nx-interactive-session.png"></img>
		</a>
	    <figcaption>Start an interactive session with srun. You can ignore the Qt session error.</figcaption>
    </figure>

1.  ***When closing an NX session, choose Suspend or Terminate***<br/>
    When you close your NX window, you will be prompted to 'Suspend' or 'Terminate' the session.  If you 'Suspend' the session, you will be able to access it again later, whereas 'Terminate' does pretty much what you'd think.
    <figure>
    		<a class="img" href="/images/nx-suspend-or-terminate.png">
    			<img class="img-temp" src="/images/nx-suspend-or-terminate.png"></img>
		</a>
	    <figcaption>Suspend or terminate the NX session.</figcaption>
    </figure>
    <figure>
    		<a class="img" href="/images/nx-connect-to-suspended-session.png">
    			<img class="img-temp" src="/images/nx-connect-to-suspended-session.png"></img>
		</a>
	    <figcaption>Previously suspended sessions appear on the dashboard.</figcaption>
	</figure>

### Mounting Odyssey storage, like home directories and lab shares, on your desktop

In addition to connecting to Odyssey servers and launching compute jobs, many scientists use Odyssey file systems for storage of lab data. These file systems can be mounted on your desktop to simplify data transfer. Odyssey file systems are shared via the Windows SMB protocol so this process is straightforward(ish).

1.  ***Connect to the VPN if on wireless, or wired connections outside of Harvard***<br/> 
    If using wireless connections, Odyssey storage **must** be routed through a VPN connection. If on wired connections inside Harvard, the VPN client is not required. If you don't already have one setup, follow the [Odyssey VPN setup instructions](/resources/vpn-setup/).
    
1.  ***Find out the name of the filesystem you want to mount***<br/>
    You can figure this out by using ssh to login to Odyssey. Use `cd` to go to the directory you wish to mount on your machine and type `df -h .` (note the . character at the end of the command). If it's your home directory, `cd ~` will work.   
    <code style="white-space: pre; margin-bottom: 0.5em; display: block;">
    [dsulivan@rclogin05 ~]$ cd ~ 
    [dsulivan@rclogin05 ~]$ df -h . 
    Filesystem                   Size Used Avail Use% Mounted on 
    rcstore:/ifs/rc_homes/home08 4.0T 8.5G 4.0T  1%   /n/home08/
    </code>
    The server name is the word before “:”, in the case above, `rcstore`. The share name is the name after `/ifs/rc_homes`. In the case above it is `home08`. The path that will be need for connecting is the combination of the servername, the word `homes`, the share name, and your username. For the example, this will be: `\\rcstore.rc.fas.harvard.edu\homes\home08\dsulivan` All the instructions below use these values in the examples. You will need to substitute `dsulivan`, `rcstore`, and `home08` with the values applicable to you. 
   
1.  ***Macs use Connect to Server***<br/> 
    If you're using a Mac, go to a Finder window (or click on the desktop) and choose Go > Connect to Server from the menu. 
    <figure>
    		<a class="img" href="/images/mac-connect-to-server.png">
    			<img class="img-temp" src="/images/mac-connect-to-server.png"></img>
		</a>
	    <figcaption>Mac Connect to Server.</figcaption>
    </figure>
    In the server address box, enter the server and path combination described above prepended with the `smb://` protocol specifier. Using the example information above, the value would be `smb://rcstore.rc.fas.harvard.edu/homes/home08/dsulivan` to mount the home directory of the `dsulivan` user.  
    <figure>
    		<a class="img" href="/images/mac-mount-home-dir.png">
    			<img class="img-temp" src="/images/mac-mount-home-dir.png"></img>
		</a>
	    <figcaption>Mount home directory on a Mac.</figcaption>
    </figure>
    If you've selected the proper volume, you should get a login prompt. Use your Odyssey credentials here. Note that you must include the `rc\` domain specifier at the beginning of your user name. 
    <figure>
    		<a class="img" href="/images/mac-smb-login.png">
    			<img class="img-temp" src="/images/mac-smb-login.png"></img>
		</a>
	    <figcaption>Use your Odyssey credentials to connect. Don't forget the `rc\`.</figcaption>
    </figure>
    
1.  ***PCs use Map Network Drive***<br/> 
    You can connect to storage on a PC by using the Map Network Drive control panel application. This should be available from a Windows Explorer window.
    <figure>
    		<a class="img" href="/images/windows8-explorer-computer.png">
    			<img class="img-temp" src="/images/windows8-explorer-computer.png"></img>
		</a>
	    <figcaption>Access Map Network Drive from the "Computer" menu on Windows Explorer.</figcaption>
    </figure>
    In the Map Network Drive utility, select a drive letter, then enter the combination of share and path. For the example described above, the correct entry would be `\\rcstore.rc.fas.harvard.edu\homes\home08\dsulivan`It is important to select the _Connect using different credentials_ box. Usually, PC logins are not the same as Odyssey usernames and passwords. If you don't select this checkbox, it will attempt to login with your PC information and may result in a lockout. 
     Also, make sure you are connected through the VPN if on wireless or off-campus -- this connection cannot be made outside of the VPN with these connection types/locations.
    <figure>
    		<a class="img" href="/images/windows8-map-network-drive.png">
    			<img class="img-temp" src="/images/windows8-map-network-drive.png"></img>
		</a>
	    <figcaption>Windows 8 Map Network Drive.Note that "Connect using different credentials" should be checked.</figcaption>
    </figure>
    When you are prompted for a login, make sure and prepend the `rc\` domain to your username.
    <figure>
    		<a class="img" href="/images/windows8-network-credentials.png">
    			<img class="img-temp" src="/images/windows8-network-credentials.png"></img>
		</a>
	    <figcaption>Login to Odyssey storage using rc domain credentials.</figcaption>
    </figure>
4.  ***Linux using a terminal window***<br/>  
    You can connect to storage on a Linux system by using the desktop GUI or from the command line. In a terminal window, enter the following commands:
    <code style="white-space: pre; margin-bottom: 0.5em; display: block;">
    mkdir /mnt/odyssey 
    mount -t cifs -o workgroup=rc,username=dsulivan //rcstore.rc.fas.harvard.edu/homes/home08/dsulivan /mnt/odyssey
    </code>
    This will prompt you for your password. If instead you get an error message about a read-only filesystem, it could be because the `mount.cifs` command is not installed on your system.Using this method, you will need to reissue the command every time you boot your computer.

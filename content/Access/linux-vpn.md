Title: Linux VPN
Date: 2015-11-10
Category: Access
Tags: Odyssey, Access
Summary: Setup of the RC VPN for Linux clients.

We recommend using [openconnect](http://www.infradead.org/openconnect) to connect to the [Research Computing VPN](vpn-setup.html) from Linux. First, install OpenConnect on Ubuntu/Debian or Fedora/CentOS, respectively:

*   Ubuntu/Debian: sudo apt-get install network-manager-openconnect-gnome

*   Fedora/CentOS: sudo yum install NetworkManager-openconnect

## Option 1: The NetworkManager GUI

*   _NOTE: If you prefer to connect using the command line, see "Using OpenConnect from command line" at the bottom of this page after installing OpenConnect._

Under your network settings, add a VPN connection and specify **vpn.rc.fas.harvard.edu** as your gateway: 

<figure>
	<a class="img" href="/docs/images/vpn01-edit-connection.png">
    		<img class="img-responsive" src="/docs/images/vpn01-edit-connection.png"></img>
	</a>
    <figcaption>Edit VPN connection.</figcaption>
</figure>


Turn on your VPN connection to bring up the connect dialog: 

<figure>
	<a class="img" href="/docs/images/vpn02-connect1.png">
    		<img class="img-responsive" src="/docs/images/vpn02-connect1.png"></img>
	</a>
    <figcaption>Connect.</figcaption>
</figure>

In the "Username" field, be sure to append "@odyssey" (the VPN realm). Enter your password and 6 digit [verification code](http://rc.fas.harvard.edu/openauth/ "openauth"): 

<figure style="width:100%">
	<a class="img" href="/docs/images/vpn03-connect2.png">
    		<img class="img-responsive" src="/docs/images/vpn03-connect2.png"></img>
	</a>
    <figcaption>Two factor auth.</figcaption>
</figure>



You should now be connected to the RC VPN. 
 

## Option 2: CLI and Build from Source

If you don't use NetworkManager, need a different version of the software, or otherwise don't have success with the above, you can try building `oath-toolkit` and `openconnect` from source and using them from the command line. The following scriptlets build each under its own prefix in `/opt/src` and install each under its own prefix in `/opt`; adjust accordingly if you want to use other locations. #### Build oath-toolkit You will need the distro version of `xmlsec`, `xmlcatalog`, etc. On Ubuntu, make sure you have installed (at least) `xmlsec1`, `libxmlsec1`, `libxmlsec1-dev`, and `libxml2-utils`. The installation is a very straighforward GNU-toolchain-style build; the following just embellishes it with some automation. Version 2.4.1 is the latest at the time of writing; newer may work better.

    :::bash
    $ export SW=/opt
    $ export SRC=$SW/src
    $ cd $SRC
    $ umask 022wget --no-clobber http://download.savannah.gnu.org/releases/oath-toolkit/oath-toolkit-2.4.1.tar.gz
    $ tar xvf $(basename $_)
    $ export APP=$(basename $_ .tar.gz)
    $ cd $APP
    $ ./configure --prefix=$SW/$APP
    $ make
    $ sudo make install


Create `/opt/oath-toolkit-2.4.1/setup.sh` with the following content:

    :::bash
    export PATH="/home/opt/oath-toolkit-2.4.1/bin:$PATH" 
    export CPATH="/home/opt/oath-toolkit-2.4.1/include:$CPATH" 
    export LD_LIBRARY_PATH="/home/opt/oath-toolkit-2.4.1/lib:$LD_LIBRARY_PATH" 
    export LIBRARY_PATH="/home/opt/oath-toolkit-2.4.1/lib:$LIBRARY_PATH" 
    export MANPATH="/home/opt/oath-toolkit-2.4.1/share/man:$MANPATH" 
    export PKG_CONFIG_PATH="/home/opt/oath-toolkit-2.4.1/lib/pkgconfig:$PKG_CONFIG_PATH"

### Build openconnect On Ubuntu
Make sure you have installed (at least) `vpnc` and `gettext`. The installation is a very straighforward GNU-toolchain-style build; the following just embellishes it with some automation. Note that we found that version 5.99 does not compile easily on Unbutu 14.04. Version 5.03 is the next-to-latest at the time of writing.

    :::bash
    $ source /opt/oath-toolkit-2.4.1/setup.shSW=/opt
    $ export SRC=$SW/src
    $ cd $SRC
    $ umask 022
    $ wget --no-clobber ftp://ftp.infradead.org/pub/openconnect/openconnect-5.03.tar.gz
    $ tar xvf $(basename $_)
    $ export APP=$(basename $_ .tar.gz)
    $ cd $APP
    $ ./configure --prefix=$SW/$APP --with-vpnc-script=/etc/vpnc/vpnc-script
    $ make
    $ sudo make install


Create `/opt/openconnect-5.03` with the following content:

	:::bash
	export CPATH="/home/opt/openconnect-5.03/include:$CPATH" 
	export FPATH="/home/opt/openconnect-5.03/include:$FPATH" 
	export LD_LIBRARY_PATH="/home/opt/openconnect-5.03/lib:$LD_LIBRARY_PATH" 
	export LIBRARY_PATH="/home/opt/openconnect-5.03/lib:$LIBRARY_PATH" 
	export MANPATH="/home/opt/openconnect-5.03/share/man:$MANPATH" 
	export PKG_CONFIG_PATH="/home/opt/openconnect-5.03/lib/pkgconfig:$PKG_CONFIG_PATH" 
	export PATH="/home/opt/openconnect-5.03/sbin:$PATH"

### Using OpenConnect from command line

After installing OpenConnect, you can connect to the VPN via the command line using:

    :::bash-session
    $ sudo openconnect -s /usr/share/vpnc-scripts/vpnc-script vpn.rc.fas.harvard.edu

Then provide:

    :::bash-session
    [sudo] password for xxxxx: <password for your computer> 
    Username: <rcusername>@odyssey 
    Password: <rcpassword> 
    Password: <six-digit authorization token>

### Using OpenConnect from command line with auto token generation 
Put your openauth (the 15-character alphanumeric string shown on your personalized OpenAuth download page) secret in a file such as `~/.s` and make sure only you can read it (e.g. `chmod 600 ~/.s`). Run the following, replacing `USERNAME` appropriately:

    :::bash
    $ source /opt/oath-toolkit-2.4.1/setup.sh
    $ source /opt/openconnect-5.03/setup.sh
    $ openconnect --user USERNAME@odyssey --token-mode=totp --token-secret=base32:$(cat ~/.s) --background vpn.rc.fas.harvard.edu

*NOTE: If you get a _Permission Denied_ error, you need to use sudo:*

    :::bash
    $ sudo openconnect --user USERNAME@odyssey --token-mode=totp --token-secret=base32:$(cat ~/.s) --background vpn.rc.fas.harvard.edu

You will then need to type your computer password (not your RC password) at the _[sudo] password for xxxxxx:_ prompt.


You should then see the connection being negotiated and will be prompted for your RC password:

    :::bash    
    POST https://vpn.rc.fas.harvard.edu
    ...
    ...
    (answer yes if you receive a certificate warning)
    ...
    ...
    Connected to HTTPS on vpn.rc.fas.harvard.edu
    Please enter your username and password.
    Password: **[enter your RC password]**
    Generating OATH TOTP token code
    POST https://vpn.rc.fas.harvard.edu/+webvpn+/index.html
    Got CONNECT response: HTTP/1.1 200 OK
    CSTP connected. DPD 30, Keepalive 30
    Connected tun0 as 10.255.12.49, using SSL
    Established DTLS connection (using OpenSSL)
    
After that you should be connected to the VPN. Leave the window open. You can terminate the session at any time by going back to the window and pressing Ctrl+C

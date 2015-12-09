Title: VPN Setup
Date: 2015-11-10
Category: Access
Tags: Odyssey, Access
Summary: Setup of the RC VPN for Mac and Windows clients.


Many of the resources available through the Odyssey cluster must be accessed through VPN (virtual private network - a sort of tunnel into the Harvard network) to protect sensitive data and prevent unauthorized access. When working outside the Harvard network, VPN protection is a must. This page describes the process for installing software and connecting to the RC VPN. _After installing the client software (see below), connect to the RC VPN using the correct address:_

    vpn.rc.fas.harvard.edu

_The FAS VPN address looks very similar (vpn.fas.harvard.edu), but will not grant you access to RC resources_

## Requirements
*   You will need a Research Computing (or "RC") account to connect to the VPN. Request an account with the [Account Request tool](account_request>). IMPORTANT: When connecting to the VPN you will use your username + @ + a VPN realm name. See instructions below.
*   Once you have an RC account, the same two-factor authentication that is used when logging in to the Odyssey system itself is incorporated into the VPN connection. Therefore, before you can access the VPN, you'll need to [install the OpenAuth tool](openauth>).

_Linux users, please [see our alternate guide to using OpenConnect](linux-vpn.html) for VPN._


## VPN Software Installation and Usage

### Windows

Automatically: The Windows client can be installed from our VPN portal: [https://vpn.rc.fas.harvard.edu](rcvpn>) 

Manually: If automatic installation fails, you should be offered an option to download an installer. After downloading the software, click on the executable to run the AnyConnect installation wizard. 

[caption id="attachment_12828" align="aligncenter" width="800"][![AnyConnect Windows installation wizard](/wp-content/uploads/2015/01/AnyConnect-Install-Windows-8-Start.png)](/wp-content/uploads/2015/01/AnyConnect-Install-Windows-8-Start.png) AnyConnect Windows installation wizard[/caption] 

Connecting: Once the client is installed, double click on the icon to get the connection dialog. Enter `vpn.rc.fas.harvard.edu` into the connection box and click on "Connect". You will be prompted for 3 values: 

<figure>
	<a class="img" href="/docs/images/anyconnect-connection-dialog-windows.png">
    		<img class="img-responsive" src="/docs/images/anyconnect-connection-dialog-windows.png"></img>
	</a>
    <figcaption>AnyConnect connection dialog with two-factor authentication.</figcaption>
</figure>

#### `Username@Realm`
Username is the RC account username assigned by the Account Request tool. It is _not_ your Harvard ID and is distinct from your laptop login. The Realm will generally be `odyssey`. There are other possible realms for specialized use by certain groups: `ncf, instrument2, ilt, helpman, huh, hprc`

#### `Password`
This is the password that you've established with the Account Request tool upon receiving your RC account. If you cannot recall this, you can [reset it here](password_reset>). It is not your Harvard PIN.

#### `Verification code`
This is the value displayed in the [OpenAuth tool](access-and-login.html#odyssey-access-requires-the-openauth-tool-for-two-factor-authentication).


### Mac

Automatically: The Mac client can be installed from our VPN portal: [https://vpn.rc.fas.harvard.edu](rcvpn>) 

Manually: If automatic installation fails, you should be offered an option to download an installer. After downloading the software, click on the downloaded image to run the AnyConnect installation wizard. 

<figure>
	<a class="img" href="/docs/images/anyconnect-diskimage.png">
    		<img class="img-responsive" src="/docs/images/anyconnect-diskimage.png"></img>
	</a>
    <figcaption>AnyConnect disk image.</figcaption>
</figure>

And start the installer by clicking on the package. 

<figure>
	<a class="img" href="/docs/images/anyconnect-installer-mac.png">
    		<img class="img-responsive" src="/docs/images/anyconnect-installer-mac.png"></img>
	</a>
    <figcaption>AnyConnect Installer (Mac).</figcaption>
</figure>

Connecting: When installation has completed, there should be a new icon in Applications under a Cisco folder. Enter `vpn.rc.fas.harvard.edu` into the connection box and click on "Connect". You will be prompted for 3 values: 

<figure>
	<a class="img" href="/docs/images/anyconnect-mac-with-openauth.png">
    		<img class="img-responsive" src="/docs/images/anyconnect-mac-with-openauth.png"></img>
	</a>
    <figcaption>Connect to VPN.</figcaption>
</figure>

#### `Username@Realm`

Username is the RC account username assigned by the Account Request tool. It is _not_ your Harvard ID and is distinct from your laptop login. The Realm will generally be `odyssey`. There are other possible realms for specialized use by certain groups: `ncf, instrument2, ilt, helpman, huh, hprc`

#### `Password`
This is the password that you've established with the Account Request tool upon receiving your RC account. If you cannot recall this, you can [reset it here](password_reset>). It is not your Harvard PIN.

#### `Verification code`
This is the value displayed in the [OpenAuth tool](access-and-login.html#odyssey-access-requires-the-openauth-tool-for-two-factor-authentication).

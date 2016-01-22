Title: Copying Data to and from Odyssey using SCP or SFTP
Date: 2014-06-23
Category: data
Summary: Transferring data to and from research computing facilities using scp and sftp.


Please use scp to copy data to and from Odyssey. 

**NB:** When using SecureFX, you cannot use the "wizard" and you must go to the SSH2 tab and check only "Keyboard Interactive" Authentication. See [the x11 page](/faq/x11) for details. 

    :::bash
    [machine] ~ > scp odyssey:~/files.tbz .
    Password:
    Enter PASSCODE:
    files.tbz                                                        100% 9664KB 508.6KB/s   00:19


The above will work on linux and on Mac OS X (terminal or X11). You can use [Cyberduck](http://cyberduck.ch/) on Mac OS X as a free graphical file transfer application. You should download Cyberduck directly from [cyberduck.ch](http://www.cyberduck.ch/ "cyberduck.ch") as it costs $5.00 from the app store and is free from the website. 

**NB:** Do **not** select the "Add password to keychain" option. 

After opening Cyberduck, click "Open Connection" Select SFTP from the drop down menu 

<figure>
	<a class="img" href="/docs/images/dropdown.png">
    		<img class="img-responsive" src="/docs/images/dropdown.png"></img>
	</a>
    <figcaption></figcaption>
</figure>

Enter your credentials and press Connect 

<figure>
	<a class="img" href="/docs/images/credentials.png">
    		<img class="img-responsive" src="/docs/images/credentials.png"></img>
	</a>
    <figcaption></figcaption>
</figure>

Enter your OpenAuth 6 digit code and press Login. Make sure you do not choose to save password (Add to keychain). 

<figure>
	<a class="img" href="/docs/images/openauth.png">
    		<img class="img-responsive" src="/docs/images/openauth.png"></img>
	</a>
    <figcaption></figcaption>
</figure>


You should now be logged in and see a window that works like a normal file browser. You may be prompted for you OpenAuth token again when transferring files. 

<figure>
	<a class="img" href="/docs/images/browser.png">
    		<img class="img-responsive" src="/docs/images/browser.png"></img>
	</a>
    <figcaption></figcaption>
</figure>

On Windows you may use [WinSCP](http://winscp.net/eng/download.php), a free graphical secure copy application. Or you may use the command line [pscp](http://the.earth.li/~sgtatham/putty/latest/x86/pscp.exe) tool. 

On WinSCP first enter the credentials 

<figure>
	<a class="img" href="/docs/images/first_0.jpg">
    		<img class="img-responsive" src="/docs/images/first_0.jpg"></img>
	</a>
    <figcaption></figcaption>
</figure>

Enter your passcode 

<figure>
	<a class="img" href="/docs/images/passcode_0.jpg">
    		<img class="img-responsive" src="/docs/images/passcode_0.jpg"></img>
	</a>
    <figcaption></figcaption>
</figure>

You should now be connected 

<figure>
	<a class="img" href="/docs/images/connected_0.jpg">
    		<img class="img-responsive" src="/docs/images/connected_0.jpg"></img>
	</a>
    <figcaption></figcaption>
</figure>

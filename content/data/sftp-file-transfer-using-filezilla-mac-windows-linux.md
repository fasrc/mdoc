Title: SFTP file transfer using Filezilla (Mac/Windows/Linux)
Date: 2014-06-23
Category: data
Tags: Odyssey
Summary: Transferring data to and from research computing facilities using Filezilla.

Filezilla is a free and open source SFTP client which is built on modern standards. It is available cross-platform (Mac, Windows and Linux) and is actively maintained. As such Research Computing is recommending its use over previous clients, especially as it does not have some of the quirks of clients like Cyberduck or SecureFX. This document will outline setting up a bookmark in Filezilla to connect to the cluster or other RC file resources you have access to.

### Download and Install

First you will need to download and install the Filezilla client: [Filezilla-project.org](https://filezilla-project.org/download.php?show_all=1) 

[](https://filezilla-project.org "Filezilla Project homepage") (Linux users may be able to install Filezilla using their respective package manager.) 

IMPORTANT: If you have never logged into Odyssey before, please insure you've gone through the [setup process](access-and-login.html) and set up your [OpenAuth](openauth>) token before proceeding.

### STEP 1

Once installed, launch Filezilla and click the _Site Manager_ icon in the upper left to begin setting up a connection bookmark for future use. 

<figure>
	<a class="img" href="/docs/images/filezilla_1.png">
    		<img class="img-responsive" src="/docs/images/filezilla_1.png"></img>
	</a>
    <figcaption></figcaption>
</figure>


### STEP 2

Click **New Site** to add a new bookmark. Enter the connection details in the General tab.

*   **Host:** enter _odyssey.rc.fas.harvard.edu_ (you can also use login.rc.fas.harvard.edu, they are interchangeable).
*   **Protocol:** select _SFTP - SSH File Transfer Protocol_
*   **Login Type:** select _Interactive_ (this is **crucial**, otherwise you will not be prompted for your OpenAuth token)
*   **User:** enter your RC account username
*   The password box will be greyed out because we're using Interactive login. If it contains dots, that's OK.
*   Now click the **Advanced** tab

<figure>
	<a class="img" href="/docs/images/filezilla_2.png">
    		<img class="img-responsive" src="/docs/images/filezilla_2.png"></img>
	</a>
    <figcaption></figcaption>
</figure>

### STEP 3

In the **Advanced** tab, select the local (i.e. - on your computer) directory/folder you'd like to start in when connecting. You can type this in or click the _Browse_ button and find the directory you want. 

You can leave **Default remote directory:** blank if you simply wish to connect to your RC account's home directory. Or, if you wish to connect to a specific directory (for instance, your lab's shared storage or a particular folder in your home directory), you can enter this here. 

<figure>
	<a class="img" href="/docs/images/filezilla_3.png">
    		<img class="img-responsive" src="/docs/images/filezilla_3.png"></img>
	</a>
    <figcaption></figcaption>
</figure>

**IMPORTANT** Click the **Transfer** tab and check the _Limit number of simultaneous connections_ box and set _Maximum number of connections_ to "1". Otherwise you will be prompted for your password and token each time the token expires and for every new simultaneous connection during file transfers. 

<figure>
	<a class="img" href="/docs/images/filezilla_3a.png">
    		<img class="img-responsive" src="/docs/images/filezilla_3a.png"></img>
	</a>
    <figcaption></figcaption>
</figure>

Click Connect to initiate a connection. If you're just making a bookmark for later, click OK. The first time you connect you will see a window titled "Unknown host key". Check the "Always trust this host, add this key to the cache" box and click OK. This will store Odyssey's key for future use. 

<figure>
	<a class="img" href="/docs/images/filezilla_3b.png">
    		<img class="img-responsive" src="/docs/images/filezilla_3b.png"></img>
	</a>
    <figcaption></figcaption>
</figure>

### STEP 4

A password prompt box will pop up. Enter your RC account password here.

*   Check "Remember password until FileZilla is closed", otherwise it will prompt you periodically and interrupt transfers
*   Click OK

<figure>
	<a class="img" href="/docs/images/filezilla_4.png">
    		<img class="img-responsive" src="/docs/images/filezilla_4.png"></img>
	</a>
    <figcaption></figcaption>
</figure>

### STEP 5

Another password box will pop up as. This is for your OpenAuth token. Enter the code shown in your OpenAuth token window (Or Google Authenticator, if you are using that alternative token generator) and click OK. 

<figure>
	<a class="img" href="/docs/images/filezilla_5.png">
    		<img class="img-responsive" src="/docs/images/filezilla_5.png"></img>
	</a>
    <figcaption></figcaption>
</figure>

###  STEP 6

You should now be connected to Odyssey and see your local files in the left-hand pane and the remote files in the right-hand pane. You can drag and drop between them or drag and drop to/from file windows on your computer. When done, click the red X icon up top to disconnect. 

<figure>
	<a class="img" href="/docs/images/filezilla_6.png">
    		<img class="img-responsive" src="/docs/images/filezilla_6.png"></img>
	</a>
    <figcaption></figcaption>
</figure>

ADVANCED TOPIC:  [Filename filtering rules in Filezilla](https://rc.fas.harvard.edu/resources/documentation/transferring-data/sftp-file-transfer/sftp-file-transfer-filtering)
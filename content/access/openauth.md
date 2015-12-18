Title: Openauth
Date: 2015-11-10
Category: access
Tags: Odyssey, Access
Summary: Overview of the OpenAuth two factor authentication.

Most Research Computing services, such as the Odyssey high performance computing cluster, VPN, and anything that prompts for "Verification code", (but not SPINAL), are protected by two-factor authentication -- access requires providing a normal password _and_ a time-dependent numeric code. We use a package, built on open standards, that we call OpenAuth to provide two-factor authentication.  

## Requesting your token
Please visit the following link, using your RC account and password, to setup your account to work with OpenAuth: 

[https://software.rc.fas.harvard.edu/openauth](openauth>) 

_Clicking this link will cause an email to be sent to you. That email will contain a link to the OpenAuth install page with instructions, download links and your personalized token._ 

The site will prompt you for your Harvard FAS Research Computing username and password. If you don't yet have an account, you can request one [here](account_request>). Since the site uses email verification to authenticate you, you must also have a valid email address on record with us. 

All OpenAuth tokens are software-based, and you will choose whether to use a smart phone or java desktop app to generate your verification codes. Java 1.6 is required for the desktop app. You must close your browser in order to logout of the site when you're done. 

Once you complete the quick steps in the above site, you'll be all set to use OpenAuth. You may also revisit that site in order to setup your token on an additional device (you'll still be able to use your original device, too). 

## Mac OS X Auto-post
For those using OS X, you might want to download and install the [OTP Token Paster for OS X](https://github.com/jwm/os-x-otp-token-paster). This service enters the current one-time password (OTP) into the current iTerm window using a hotkey. 

## Revoking / Resetting 
Please keep in mind the [revoke](revoke>) link if you ever lose the device with your token or otherwise insecurely handle your token and need to start over with a new one. 

## Synchronizing clocks
The OpenAuth system uses a time-based algorithm for generating verification codes (TOTP, [RFC 6238](http://tools.ietf.org/html/rfc6238)). In order for this to work, _**your computer's time must be in sync with our servers' time**_. Our servers are synchronized with official time sources.

If you're consistently getting re-prompted for your `Password` and `Verification code`, it might be because your clock is off. You can check offical time for US timezones [here](http://www.time.gov/). _**Your timezone setting is especially important to consider**_. If you are in a different timezone, you must adjust your computer's clock by adjusting the timezone, not just the time, so that your computer still accurately reflects the correct absolute time. For example, if you leave Cambridge and go to Los Angeles, you must change your clock by changing the timezone from Eastern time to Pacific time (a difference of three hours). If you just set your clock back three hours, and leave it in the Eastern timezone, openauth will treat you the same as a person in Cambridge with a clock that's off by three hours, and you will not be able to authenticate.

Most operating systems can be set to automatically maintain your correct timezone. Here's an example of what that looks like on a Mac:

<figure>
	<a class="img" href="/docs/images/mac_timezone.png">
    		<img class="img-responsive" src="/docs/images/mac_timezone.png"></img>
	</a>
    <figcaption>Timezone configuration on Mac OS X.</figcaption>
</figure>


OpenAuth allows for clocks to be off by about a minute or two. Any more than that, and the system rejects you, same as if you typed an incorrect `Verification code`. However, if your clock is off by more than a couple minutes but not more than 12 hours, it is possible to _resync_ your secret token and have the system automatically adjust for the skew. This feature should only by used if you are not able to synchronize your computer's clock properly. In order to perform the resync, you must ssh to `login.rc.fas.harvard.edu` and enter three different, sequential Verification codes, one at each `Verification code` prompt. For example, a command-line ssh session on a Mac or linux host will look something like this:

    :::bash
    USERNAME@MYCOMPUTER:~$ ssh USERNAME@login.rc.fas.harvard.edu 
    Password: 
    Verification code: 
    Password: 
    Verification code: 
    Password: 
    Verification code: 
    USERNAME@rclogin01:~$`

Note that if you later correct your clock, or switch to using a different computer or smartphone with a correct clock, you'll have to go through the same resync procedure in order to "unskew" your secret token.

## Manual installations

The instructions here do not generally apply to most users. See the [OpenAuth page for normal setup.](openauth.html) Please do not use the manual setup unless you truly need to or are sure this is what you desire.


If you prefer not to install our pre-configured client or you have a class account not tied to your email address, you can set up your OpenAuth token manually. This will require an OpenAuth token code which is either gained from:

1.  Your TA or instructor if you have been given a class account that is not tied to your email address.
2.  [Logging into the OA page with your RC username and password](openauth>), receiving an email with a link to the OA, and copying the code shown at the bottom of that page.

Download the non-configured client for your OS here (requires RC username and password):

* [JAuth_windows_1_0.exe](JAuth_windows_1_0.exe) (for Windows) 
* [JAuth_macos_1_0.dmg](JAuth_macos_1_0.dmg) (for Mac) 
* [JAuth_unix_1_0.sh](JAuth_unix_1_0.sh) (for Linux) 

_Remember, _you_ have to enter your secret token manually as described above. There is _no_ token code embedded in these clients._
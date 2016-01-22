Title: Using the Amazon S3 Storage from Odyssey
Date: 2014-06-23
Category: software
Tags: Odyssey, Amazon
Summary: Accessing S3 storage from Odyssey

Go to [Amazon S3](http://aws.amazon.com/s3/) and get an account. You will get assigned an Access Key ID and a Secret Access Key, which you can view [here](https://aws-portal.amazon.com/gp/aws/developer/account/index.html?action=access-key). Once you have these then:

    :::bash
    [hptc@iliadaccess02 ~]$ module load s3cmd
    [hptc@iliadaccess02 ~]$ s3cmd
    ERROR: /n/home/external/hptc/.s3cfg: No such file or directory
    ERROR: Configuration file not available.
    ERROR: Consider using --configure parameter to create one.
    [hptc@iliadaccess02 ~]$ s3cmd --configure

    Enter new values or accept defaults in brackets with Enter.
    Refer to user manual for detailed description of all options.

    Access key and Secret key are your identifiers for Amazon S3
    Access Key: &lt;S3AccessKey&gt;
    Secret Key: &lt;S3SecretKey&gt;

    Encryption password is used to protect your files from reading
    by unauthorized persons while in transfer to S3
    Encryption password: &lt;password&gt;
    Path to GPG program [/usr/bin/gpg]:

    When using secure HTTPS protocol all communication with Amazon S3
    servers is protected from 3rd party eavesdropping. This method is
    slower than plain HTTP and can't be used if you're behind a proxy
    Use HTTPS protocol [No]: Yes

    New settings:
      Access Key: &lt;S3AccessKey&gt;
      Secret Key: &lt;S3SecretKey&gt;
      Encryption password: &lt;password&gt;
      Path to GPG program: /usr/bin/gpg
      Use HTTPS protocol: True
      HTTP Proxy server name:
      HTTP Proxy server port: 0

    Test access with supplied credentials? [Y/n] Y
    Please wait...
    Success. Your access key and secret key worked fine :-)

    Now verifying that encryption works...
    Success. Encryption and decryption worked fine :-)

    Save settings? [y/N] y
    Configuration saved to '/n/home/external/hptc/.s3cfg'
    [hptc@iliadaccess02 ~]$ ls -l ~/.s3cfg
    -rw------- 1 hptc fas_it 1085 Apr  3 16:47 /n/home/external/hptc/.s3cfg
    [hptc@iliadaccess01 ~]$ man s3cmd
    [hptc@iliadaccess01 ~]$ s3cmd mb s3://test
    Bucket 's3://test/' created
    [hptc@iliadaccess01 ~]$ s3cmd ls
    2009-04-03 14:57  s3://test
    [hptc@iliadaccess02 ~]$ ls
    foo
    [hptc@iliadaccess01 ~]$ s3cmd put foo s3://test
    foo -&gt; s3://test/foo  [1 of 1]
     86379 of 86379   100% in    0s   176.33 kB/s  done
    [hptc@iliadaccess02 ~]$ s3cmd ls s3://test
    2009-04-03 20:57       842   s3://test/foo
    [hptc@iliadaccess02 ~]$ rm foo
    [hptc@iliadaccess02 ~]$ s3cmd get s3://test/foo
    s3://test/foo -&gt; ./foo  [1 of 1]
     842 of 842   100% in    0s     7.34 kB/s  done
    [hptc@iliadaccess02 ~]$ ls
    foo
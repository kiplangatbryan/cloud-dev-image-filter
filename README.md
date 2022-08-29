# Udagram Image Filtering Microservice

# changes made

The server validates the image url provided and sends back an error message if the url is invalid 


`
{
    acknowledged: 'failed',
    content: 'Enter a valid image url'
}
`

## deployment steps

### eb init
 - used this command to configure elastic beanstalk environment locally.

 ### eb create
 - created an elastic beanstalk application in my aws account

 ### eb deploy 
 - deploy changes to changes to a running instance in my elastic beanstalk environment.


## git repository

https://github.com/kiplangatbryan/cloud-dev-image-filter

## elastic beanstalk deployment link

http://image-filter-starter-code2-dev.us-east-1.elasticbeanstalk.com/

## NB

    - I had a really had time deploying, I followed all the steps but i kept getting the severe flag. Untill i added the the environment variable below. 

    `
    NPM_USE_PRODUCTION = false
    `

    I still dont know why it kept breaking for a basic application like this.

    If you have any information please enlighten me
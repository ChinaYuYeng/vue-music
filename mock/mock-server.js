import Mock from 'mockjs'

Mock.mock('pdata', {
    'list|1-10': [{
            'id|+1': 1,
            'email': '@EMAIL'
       }]
})

Mock.mock('banner', {
    'banners': [
    	{src:'b1'},
    	{src:'b2'}
    ]
})

export default Mock;
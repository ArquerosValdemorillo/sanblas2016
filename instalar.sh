rsync -avze ssh client/ arquerosvaldemorillo.es:/opt/sanblas.arquerosvaldemorillo.es/
rsync -avze ssh --exclude 'config.json' server/ arquerosvaldemorillo.es:/opt/sanblas2016_api/

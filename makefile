##################################################################################
DATA_SOURCE ?= main
MIGRATION_NAME ?= init

preCatDatasourceFile:
	rm -rf prisma/$(DATA_SOURCE).prisma

catDatasourceFile: preCatDatasourceFile
	cat ./prisma/datasource/$(DATA_SOURCE).prisma >> ./prisma/$(DATA_SOURCE).prisma

catMultiPrismaFile: catDatasourceFile
	cat ./prisma/models/$(DATA_SOURCE)/*.prisma >> ./prisma/$(DATA_SOURCE).prisma

migrateDev: catMultiPrismaFile
	prisma migrate dev --schema prisma/$(DATA_SOURCE).prisma --name $(DATA_SOURCE)_$(MIGRATION_NAME)
	rm -rf prisma/$(DATA_SOURCE).prisma

migrate: catMultiPrismaFile
	prisma migrate deploy --schema prisma/$(DATA_SOURCE).prisma
	rm -rf prisma/$(DATA_SOURCE).prisma

migrateReset: catMultiPrismaFile
	prisma migrate reset --schema prisma/$(DATA_SOURCE).prisma
	rm -rf prisma/$(DATA_SOURCE).prisma

studio: catMultiPrismaFile
	sudo prisma studio --schema=prisma/$(DATA_SOURCE).prisma

createMysqlContainer:
	docker run --name docker-mysql -e MYSQL_ROOT_PASSWORD=alfieri -p 3306:3306 -d mysql

defaultEnv:
	echo "DATABASE_URL=mysql://root:alfieri@localhost:3306/test" >> .env
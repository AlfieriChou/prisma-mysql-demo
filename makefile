##################################################################################
DATA_SOURCE ?= main
MIGRATION_NAME ?= init

catDatasourceFile:
	cat ./prisma/datasource/$(DATA_SOURCE).prisma >> ./prisma/$(DATA_SOURCE).prisma

catMultiPrismaFile: catDatasourceFile
	cat ./prisma/$(DATA_SOURCE)/*.prisma >> ./prisma/$(DATA_SOURCE).prisma

migrate: catMultiPrismaFile
	prisma migrate dev --schema prisma/$(DATA_SOURCE).prisma --name $(DATA_SOURCE)_$(MIGRATION_NAME)
	rm -rf prisma/$(DATA_SOURCE).prisma
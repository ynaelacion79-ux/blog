-- Create new PostgreSQL user and grant privileges
CREATE USER recipe_user WITH PASSWORD 'recipe123';
ALTER USER recipe_user CREATEDB;
GRANT ALL PRIVILEGES ON DATABASE wendells_recipe TO recipe_user;

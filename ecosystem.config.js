module.exports = {
  apps: [
    {
      name: "belajar-api",
      script: "dist/main.js",
      env: {
        PORT: 8888,
        DATABASE_URL: "mysql://root:root@localhost:3306/belajar_typescript_restful_api",
        NODE_ENV: "development"
      },
      env_production: {
        PORT: 8888,
        DATABASE_URL: "mysql://root:root@localhost:3306/belajar_typescript_restful_api",
        NODE_ENV: "production"
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "200M",
      error_file: "./logs/error.log",
      out_file: "./logs/out.log",
      merge_logs: true,
      log_date_format: "YYYY-MM-DD HH:mm:ss Z"
    }
  ]
};

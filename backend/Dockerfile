# --- STAGE 1: BUILD THE APPLICATION ---
FROM node:20-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install all dependencies, including devDependencies, and ignore the prepare script
RUN npm install --ignore-scripts

# Copy the rest of the application code (including src)
COPY . .

# Run the build script to compile TypeScript
# The output will be in /app/dist because tsconfig.json has "outDir": "../dist" relative to "src"
RUN npm run build

# --- STAGE 2: CREATE THE FINAL PRODUCTION IMAGE ---
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy only the necessary production files from the builder stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

# Copy the swagger folder from its new location within src/common
COPY --from=builder /app/src/common/swagger ./dist/common/swagger

# Install only production dependencies, and ignore the prepare script
RUN npm install --only=production --ignore-scripts

# Expose the port
EXPOSE 5000

# Set the command to run the application
CMD ["npm", "start"]

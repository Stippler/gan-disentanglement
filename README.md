# GAN Disentanglement

Welcome to the world of Generative Adversarial Networks (GANs) disentanglement! Before we begin, please note that this code has only been tested on Ubuntu 20.04 with RTX 3090 Ti graphics card.
This readme contains a detailed step-by-step tutorial that would guide you through starting the frontend and the data generation part.

## Table of Contents
1. [Download Data](#download-data)
2. [Frontend](#frontend)
3. [Data Generation](#data-generation)

## Download Data <a name="download-data"></a>

Navigating the labyrinth of StyleGANs set-up may seem like a Herculean task, given its intricate web of dependencies and the need for precise version compatibility.
Add to this the time-consuming data generation that could potentially take days and the hardware requirement of a high-end graphics card, and you're looking at a veritable odyssey of GAN disentanglement. 

Doesn't that sound like an action-packed adventure?
Well, if for some reason, you'd prefer to skip this exhilarating challenge, we've got your back.
We offer you the 'Download Data' express ticket!
[Click Here](https://owncloud.tuwien.ac.at/index.php/s/CWduw7BT5vUYMB9) for access to the data.


## Frontend <a name="frontend"></a>

**Step 1: Install Node Version Manager (nvm)**

Start by installing Node Version Manager (nvm), an indispensable tool for managing multiple Node.js versions. Run the following command:

```bash
# Fetch the nvm installation script and execute it
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
```

This command downloads and runs the installation script directly from the official nvm GitHub repository. Upon completion, nvm is installed on your system, ready to help manage your Node.js versions.

Next, install a specific version of Node.js using nvm. For instance, to install Node.js version 20, you can run:

```bash
# Use nvm to install Node.js version 20
nvm install 20
```

**Step 2: Install dependencies**

With Node.js setup, it's time to prepare the project environment. Navigate to your project directory and run:

```bash
# navigate to your project
cd path/to/app
# Install dependencies
npm install
```

This command reads the package.json file in your project directory and installs all the dependencies listed there into a folder named node_modules.

**Step 3: Build and start the project**

Once you're ready to take your project live, you need to build it for production:

```bash
# Build the project for production
npm run build
```

This command typically bundles your code, minifies it, and performs other optimizations to ensure your application runs efficiently in a production environment. When the build process is completed successfully, it's time to start your application:

```bash
# Start the application in production mode
npm run start
```

This command launches your built application, ready to serve incoming requests from users. Congratulations, your project setup is complete and your application is live!

**Step 4: Start the development server**

After all dependencies are installed, let's fire up the development server with:

```bash
# Start the development server
npm run dev
```

This command usually starts a local development server with features like hot reloading, which means your application will automatically refresh whenever you make changes to the source code.


## Data Generation <a name="data-generation"></a>

The process of data generation consists of several steps, starting from setting up the necessary environment, downloading pretrained models, and generating the required data. 

1. Clone the repository [stylegan2-ada-pytorch](https://github.com/NVlabs/stylegan2-ada-pytorch) and set up the environment according to the instructions in the readme of the repository and copy the scripts:

```bash
git clone https://github.com/NVlabs/stylegan2-ada-pytorch
cd stylegan2-ada-pytorch
# Proceed with the setup according to the repository's README.
cp -r ../scripts/* .
```

2. Download the [256x256 ffhq model](https://nvlabs-fi-cdn.nvidia.com/stylegan2-ada-pytorch/pretrained/transfer-learning-source-nets/ffhq-res256-mirror-paper256-noaug.pkl), create a directory named 'pretrained_models', and place the model weights in it:

```bash
mkdir pretrained_models
cd pretrained_models
wget https://nvlabs-fi-cdn.nvidia.com/stylegan2-ada-pytorch/pretrained/transfer-learning-source-nets/ffhq-res256-mirror-paper256-noaug.pkl -O ffhq.pkl
cd ..
```

3. Generate the training data by executing the following command:

```bash
python generate_walks.py --trunc=0.7 --outdir=out
```

4. In parallel, you can train the MobileNet classifier using the `classification_multimodel.ipynb` as a starting point. Ensure to place all model checkpoints in the correct folder at the end following the naming convention: `mobile_mobile_nets/{direction}.pt`.

5. Run `directions_z.py` and `directions_w.py` to train the directions for the walks:

```bash
python directions_z.py
python directions_w.py
```

6. Generate the walks using `generate_walks.py`:

```bash
python generate_walks.py -s w
python generate_walks.py -s z
```

7. Go to the frontend folder and create a database:

```bash
cd frontend
npx prisma db push
cd ..
```

8. Use `insert.py` to add the classifications to the database:

```bash
python insert.py --img_dir=out/walks/z --space=z
python insert.py --img_dir=out/walks/w --space=w
```

9. Generate videos using `generate_videos.py`:

```bash
python generate_videos.py --walk_type=w
python generate_videos.py --walk_type=z
```

10. Finally, spin up the frontend in the `app` directory and execute `add_jsons.py` to convert the data from the SQLite database to JSON chunks for faster loading:

```bash
cd app
python add_jsons.py
```

Congratulations! You should now have a `chunks` folder which you can move into `app`, and a `videos` folder which you can move into `app/public`. You are now ready to analyze the GAN disentanglement with the application.

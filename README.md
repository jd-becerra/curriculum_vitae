# My Curriculum Vitae: An Interactive Site with Three.js + Vue.js

This is my personal curriculum website, built using Three.js and Vue.js. It features an interactive 3D scene that showcases my skills and experience in a visually engaging way.

**Go to the bottom of this README to see instructions on how to interact with the site**
![Demo](public/img/info/demo.gif)

## Why this project?

I wanted to create a unique and interactive way to present my curriculum vitae, moving away from traditional static formats. I've always had an interest for graphics programming and 3D rendering, and I wanted to combine these interests with my web development skills to create a unique experience that showcases my skills and experience.

## Features

- Interactive 3D scene using Three.js
- Responsive design with Vue.js
- Smooth animations and transitions
- Easy navigation and user-friendly interface
- Supports languages: English and Spanish
- Download CV in PDF format for a more traditional presentation

## Tools

The main tools used for the development of this website combined a lot of skills from different fields:

- **Blender**: for 3D modeling and animation.
- **GIMP**: for image editing and texture creation.
- **Three.js**: for rendering 3D graphics in the browser.
- **Vue.js**: for building the user interface and managing state.
- **Pinia**: for state management in Vue.js applications.
- **i18n**: for internationalization and localization support.

## How does this site work?

The site is built using Vue.js for the frontend and Three.js for the 3D graphics. The main components include:

- **3D Scene**: The interactive 3D scene is rendered using Three.js. Some of the techniques I used include:
  - Shader programming
  - Texture mapping
  - Lighting systems
  - GLTF model loading
  - Post-processing effects
  - Animations
  - Camera controls
  - Instancing
  - Rendering techniques
  - Raycasting
- **Vue Components**: The UI is built using Vue.js components, making it easy to manage state and handle user interactions. Three.js also allows the possibility to render Vue components within the 3D scene (as seen on the computer for the "My Projects" section).
- **State Management**: Pinia is used for state management in the Vue.js application, providing a simple and intuitive API for managing application state. This is what allows Three.js and Vue to communicate with each other and handle events such as: mouse clicks, scene navigation, and updating the rendering state of different components.
- **Internationalization**: The site supports multiple languages, allowing users to switch between English and Spanish. Using the i18n library along Pinia allowed to be able to update 3D components dynamically based on the selected language.

## How can I interact with this site?

You can interact with the 3D scene by using your mouse to click on different objects.

1. **Click on highlighted objects to interact with them.**

   ![Click Interaction](public\img\info\click.gif)

2. **Click and drag mouse to move the camera.**

   ![Click and Drag](public\img\info\drag.gif)

3. **Scroll mouse wheel to zoom in and out.**

   ![Scroll Zoom](public\img\info\zoom.gif)

4. **You can also use the navigation menu on the left side to move between sections.**

   ![Navigation Menu](public\img\info/instructions_navigation.gif)

5. **To change the language or see the instructions listed above, click on the "Help and Settings" button located on the top left corner.**
6. **If you want to download the CV in a traditional PDF format, click the button on the left side of the screen.**

export const mockData = {
  title: "FizzBuzz Challenge",
  type: "CODEPRACTICE",
  lesson: 51,
  data: {
      task_description: `
            # React Markdown Example

        - Some text
        - Some other text

        ## Subtitle

        ### Additional info

        This is a [link](https://github.com/remarkjs/react-markdown)
      `,
      output: `1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz`,
      languages: {
      PY: "def fizzbuzz(n):\n    # Your code here",
      JS: "function fizzbuzz(n) {\n  // Your code here\n}",
      JAVA: "public class Main {\n  public static void main(String[] args) {\n    // Your code here\n  }\n}"
    }
    }
  };

export const theoryPage = {
  id: 102,
  lesson: 51,
  title: "Intro to React Components",
  type: "THEORY",
  order: 1,
  data: [
    {
      type: "MD",
      content:
        "# Introduction\nReact is a JavaScript library for building user interfaces. It lets you compose UIs from small, isolated pieces called components."
    },
    {
      type: "MD",
      content:
        "## Key Ideas\n- Components are reusable UI building blocks.\n- JSX is a syntax that looks like HTML but compiles to JavaScript.\n- Data flows down via *props*; internal data is stored in *state*.\n- Rendering is declarative: describe what the UI should look like for a given state."
    },
    {
      type: "IMAGE",
      src: "https://www.patterns.dev/img/reactjs/react-components@1.5x.svg",
      alt: "Component tree diagram showing App with Header, Main and Footer children",
      caption: "A simple component hierarchy.",
      credit: "Course Team"
    },
    {
      type: "MD",
      content:
        "## JSX in a Nutshell\nJSX lets you write UI markup directly inside JavaScript. Under the hood, it turns into function calls that create lightweight descriptions of the UI."
    },
    {
      type: "CODE",
      language: "JS",
      content:
        "import React from 'react';\nimport ReactDOM from 'react-dom/client';\n\nfunction Greeting(props) {\n  return <h1>Hello, {props.name}!</h1>;\n}\n\nconst root = ReactDOM.createRoot(document.getElementById('root'));\nroot.render(<Greeting name=\"React Learner\" />);"
    },
    {
      type: "MD",
      content:
        "## Props vs State\n- **Props**: read-only inputs passed from a parent component.\n- **State**: internal, mutable data managed by a component."
    },
    {
      type: "CODE",
      language: "JS",
      content:
        "import { useState } from 'react';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  return (\n    <button onClick={() => setCount(count + 1)}>\n      Clicked {count} times\n    </button>\n  );\n}"
    },
    {
      type: "VIDEO",
      url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      caption: "What is React? A 3-minute overview.",
      poster: "https://www.womansworld.com/wp-content/uploads/2019/09/cute-bunny-in-a-field-of-grass-and-white-flowers.jpg?quality=86&strip=all",
      duration_sec: 180
    },
    {
      type: "MD",
      content:
        "## Next Steps\n- Create a new component and render it in your app.\n- Pass props to customize behavior.\n- Add state with `useState` to make it interactive."
    }
  ],
  created_at: "2025-08-10T14:55:00+03:00",
  updated_at: "2025-08-10T14:55:00+03:00"
};

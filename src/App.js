import React, { Component } from "react"
import logo from "./logo.svg"
import "./App.css"
import { compose, graphql } from "react-apollo"
import ListRecipes from "./queries/ListRecipes.js"
import CreateRecipe from "./mutations/CreateRecipe.js"
import uuidV4 from "uuid/v4"

class App extends Component {
  state = {
    name: "",
    ingredient: "",
    direction: "",
    ingredients: [],
    directions: [],
  }

  onChange = (key, value) => {
    this.setState({ [key]: value })
  }

  addIngredient = () => {
    if (this.state.ingredient === "") return
    const ingredients = this.state.ingredients
    ingredients.push(this.state.ingredient)
    this.setState({
      ingredient: "",
      ingredients,
    })
  }

  addDirection = () => {
    if (this.state.direction === "") return
    const directions = this.state.directions
    directions.push(this.state.direction)
    this.setState({
      direction: "",
      directions,
    })
  }

  addRecipe = () => {
    const { name, ingredients, directions } = this.state
    this.props.onAdd({
      name,
      ingredients,
      directions,
      id: uuidV4(),
    })
    this.setState({
      name: "",
      ingredient: "",
      direction: "",
    })
  }

  render() {
    const { name, ingredient, direction } = this.state
    return (
      <div className="App" style={style.container}>
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        {this.props.recipes.map((recipe, index) => (
          <div key={index}>
            <p>{recipe.name}</p>
          </div>
        ))}
        <input
          value={name}
          placeholder="Recipe name"
          style={style.input}
          onChange={e => this.onChange("name", e.target.value)}
        />

        <input
          value={ingredient}
          placeholder="ingredient name"
          style={style.input}
          onChange={e => this.onChange("ingredient", e.target.value)}
        />
        <button style={style.button} onClick={this.addIngredient}>
          add ingredient
        </button>

        <input
          value={direction}
          placeholder="direction name"
          style={style.input}
          onChange={e => this.onChange("direction", e.target.value)}
        />
        <button style={style.button} onClick={this.addDirection}>
          add direction
        </button>
        <button style={style.button} onClick={this.addRecipe}>
          add recipe
        </button>
      </div>
    )
  }
}

const style = {
  input: {
    height: 50,
    width: 450,
    fontSize: 16,
    border: "none",
    borderBottom: "2px solid blue",
    margin: 10,
  },
  button: {
    height: 40,
    width: 450,
    margin: 10,
  },
  container: {
    display: "flex",
    flexFlow: "column nowrap",
    alignItems: "center",
  },
}

export default compose(
  graphql(ListRecipes, {
    options: {
      // when the app load use the data from the cache first but fetch new data from the database and if different to the cache then use that data
      fetchPolicy: "cache-and-network",
    },
    props: props => {
      return {
        recipes: props.data.listRecipes ? props.data.listRecipes.items : [],
      }
    },
  }),
  graphql(CreateRecipe, {
    props: props => ({
      onAdd: recipe => {
        return props.mutate({
          variables: recipe,
          optimisticResponse: {
            __typename: "Mutation",
            createRecipe: { ...recipe, __typename: "Recipe" },
          },
          update: (proxy, { data: { createRecipe } }) => {
            // current data return from ListRecipes query
            const data = proxy.readQuery({ query: ListRecipes })
            data.listRecipes.items.push(createRecipe) // push in new recipes
            proxy.writeQuery({ query: ListRecipes, data }) // update the new recipe
          },
        })
      },
    }),
  })
)(App)

import React, { Component } from "react"
import logo from "./logo.svg"
import "./App.css"
import { compose, graphql } from "react-apollo"
import ListRecipes from "./queries/ListRecipes.js"
import CreateRecipe from "./mutations/CreateRecipe.js"

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

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        {this.props.recipes.map((recipe, index) => (
          <div>
            <p>{recipe.name}</p>
          </div>
        ))}
      </div>
    )
  }
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
  })
)(App)

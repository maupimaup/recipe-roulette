import React, { useEffect, useState } from 'react';
import { AppDispatch, RootState, useRecipeDispatch, useRecipeSelector } from '../store/store';
import { Recipe } from '../models/types';
import { getRecipeRandom, postSaveRecipe } from '../store/reducers/recipesReducer';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../services/firebase';
import { useNavigate } from 'react-router-dom';
// import AuthDetails from "../components/auth/authDetails";


const RandomResults: React.FC = () => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useRecipeDispatch();
  const { recipes } = useRecipeSelector((state: RootState) => state.recipes);
  const [user] = useAuthState(auth);
  const [errorMessage, setErrorMessage] = useState(""); 

  const handleRandom = async () => {
    console.log("newRecipe: ");
    dispatch(getRecipeRandom());
  }

  const handleHomepage = () => {
    navigate(`/`);
  };

  const handleSaveRecipe = async (recipeId: number, recipe: Recipe) => {
    if (!user) {
      console.error('User not logged in');
      setErrorMessage("Please log in on the homepage.");
      return;
    }

    dispatch(postSaveRecipe(recipeId, recipe, user));
  };

  useEffect(() => {
  }, [dispatch]);

  return (
    <div>
      <br /><br />
      {/* TODO: replace br with css */}
      <button className="randomresult__homepage-button" onClick={handleHomepage}>
        Return to home
      </button>
      <section className="randomresults">
        <button className="randomresult__getdifferent-button" onClick={handleRandom}>
          Next
        </button>
        {!Array.isArray(recipes) ? '' : recipes.map((r: any) => (
          <article key={r.id} className="randomresult">
            <button className="randomresult__save-button" onClick={() => handleSaveRecipe(r.id, r)}>Save</button>
            <article className="errorMessage">
          {errorMessage && <p className="errorMessage__text">{errorMessage}</p>}
        </article>
            <h2 className="randomresult__title">{r.title}</h2>
            <img className="randomresult__image" src={r.image} alt={r.title} />
            <h3 className="randomresult__ingredients-heading">Ingredients:</h3>
            <ul className="randomresult__ingredients-list">
              {r.extendedIngredients.map((i: any) => (
                <li key={`${r.id}-${i.id}`} className="randomresult__ingredient">{i.original}</li>
              ))}
            </ul>
            <h3 className="randomresult__instructions-heading">Instructions:</h3>
            <div className="randomresult__instructions" dangerouslySetInnerHTML={{ __html: r.instructions }}></div>
            {/* <AuthDetails /> */}
          </article>
        ))}
      </section>
    </div>
  );
};

export default RandomResults;
import React, { useContext, useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Row, Col, Form, Image } from 'react-bootstrap';
import DeleteMealModal from '../modals/DeleteMealModal';
import EditMealModal from '../modals/EditMealModal';
import MealCard from '../common/MealCard';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { toast } from 'react-toastify';
import { UserContext } from '../providers/AuthProvider';
import { firestore, storage } from '../../firebase';
import { addDoc, collection, getDocs, query, where } from '@firebase/firestore';


const Meals = () => {
  const [meals, setMeals] = useState(null);
  const [showEditMealModal, setShowEditMealModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const mealImageFile = useRef(null);

  const defaultData = {
    name: '',
    price: '',
    id: ''
  }

  const defaultDeleteData = {
    restaurantId: '',
    mealId: '',
    mealImageFileURL: ''
  };

  const [editDfaultData, setEditDefaultData] = useState(defaultData);
  const [deleteMealData, setDeleteMealData] = useState(defaultDeleteData)
  const restaurant = useContext(UserContext);

  const hideEditMealModal = () => {
    setEditDefaultData(defaultData);
    setShowEditMealModal(false);
  };

  const hideDeleteModal = () => setShowDeleteModal(false);


  const displayEditMealModal = (meal) => {
    const defaultData = {
      name: meal.name,
      price: meal.price,
      id: meal.id,
      restaurantId: restaurant.id,
      restaurantSlug: restaurant.slug
    }
    setEditDefaultData(defaultData);
    setShowEditMealModal(true);
  }

  const displayDeleteMealModal = (meal) => {
    const deleteMealData = {
      id: meal.id,
      fileName: meal.fileName,
      restaurantId: meal.restaurantId,
      slug: restaurant.slug
    }
    setDeleteMealData(deleteMealData);
    setShowDeleteModal(true);
  }

  const fetchMeals = async () => {
    const mealsCollectionName = process.env.NODE_ENV === 'production' ? 'Meals' : 'Meals_dev';
    const mealsRef = collection(firestore, mealsCollectionName);
    const q = query(mealsRef, where("restaurantId", "==", restaurant.id));
    const mealsSnapshot = await getDocs(q);
    if (!mealsSnapshot.empty) {
      const data = mealsSnapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data()
        }
      });

      setMeals(data);
    } else {
      setMeals(null);
    }
  }

  useEffect(() => {
    const fetchMeals = async () => {
      const mealsCollectionName = process.env.NODE_ENV === 'production' ? 'Meals' : 'Meals_dev';
      const mealsRef = collection(firestore, mealsCollectionName);
      const q = query(mealsRef, where("restaurantId", "==", restaurant.id));
      const mealsSnapshot = await getDocs(q);
      if (!mealsSnapshot.empty) {
        const data = mealsSnapshot.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data()
          }
        });

        setMeals(data);
      } else {
        setMeals(null);
      }
    }
    fetchMeals();
  }, [restaurant]);

  return (
    <>
      <EditMealModal defaultData={editDfaultData} refresh={fetchMeals} show={showEditMealModal} onHide={hideEditMealModal} />
      <DeleteMealModal deleteMealData={deleteMealData} refresh={fetchMeals} show={showDeleteModal} onHide={hideDeleteModal} />
      <div className='p-4 bg-white shadow-sm'>
        <AddMeals restaurant={restaurant} setMeals={setMeals} mealImageFile={mealImageFile} />
        {!meals && <div style={{ fontSize: '15px', fontWeight: 'bold' }}>You don't have any meals.</div>}
        {(meals && meals.length > 0) && <MealsContainer displayDeleteMealModal={displayDeleteMealModal} displayEditMealModal={displayEditMealModal} meals={meals} />}
      </div>
    </>
  )
}

const MealsContainer = ({ meals, displayEditMealModal, displayDeleteMealModal }) => {
  return (
    <Row>
      <Col md={12}>
        <h3 className="font-weight-bold mt-3 mb-4">Your meals</h3>
      </Col>
      {
        meals && meals.map(meal => <Meal key={meal.id} meal={meal} displayEditMealModal={displayEditMealModal} displayDeleteMealModal={displayDeleteMealModal} />)
      }
    </Row>
  )
}

const AddMeals = ({ setMeals, mealImageFile, restaurant }) => {
  const [mealName, setMealName] = useState(null);
  const [mealPrice, setMealPrice] = useState(null);
  const [mealFileName, setMealFileName] = useState(null);
  const [loading, setLoading] = useState(false);


  const fetchMeals = async () => {
    const mealsCollectionName = process.env.NODE_ENV === 'production' ? 'Meals' : 'Meals_dev';
    const mealsRef = collection(firestore, mealsCollectionName);
    const q = query(mealsRef, where("restaurantId", "==", restaurant.id));
    const mealsSnapshot = await getDocs(q);
    if (!mealsSnapshot.empty) {
      const data = mealsSnapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data()
        }
      });

      setMeals(data);
    } else {
      setMeals(null);
    }
  }

  const addMeal = () => {
    if (!(mealName && mealPrice && mealImageFile)) {
      toast.warning("Please fill all form fields");
      return;
    }
    if (!mealName) {
      toast.warning("Please enter a valid meal name");
      return;
    }
    if (!mealPrice) {
      toast.warning("Please enter a valid meal price");
      return;
    }
    if (!mealImageFile) {
      toast.warning("Please attach an image file for this meal");
      return;
    }

    const mealsCollectionName = process.env.NODE_ENV === 'production' ? 'Meals' : 'Meals_dev';
    const mealsRef = collection(firestore, mealsCollectionName);
    const storageRef = ref(storage);
    const restaurantId = restaurant.id;
    const restaurantSlug = restaurant.slug;

    setLoading(true);
    if (mealImageFile.current.files.length > 0) {
      const imageFile = mealImageFile.current.files[0];
      let [, extension] = imageFile.name.split(".");
      // generate a random file name
      let fileName = uuidv4();
      fileName = fileName.substring(0, 15);
      // checks if the size of the file is larger than 1 megabyte
      if (imageFile.size > 1000000) {
        toast.info("Image file cannot be larger than 1MB");
        setLoading(false);
        return;
      }

      const mealsDirectoryName = process.env.NODE_ENV === 'production' ? 'Meals' : 'Meals_dev';
      const mealsStorageRef = ref(storageRef, mealsDirectoryName);
      const restaurantRef = ref(mealsStorageRef, restaurantSlug);
      const mealFileRef = ref(restaurantRef, `${fileName}.${extension}`);

      uploadBytes(mealFileRef, imageFile)
        .then(response => getDownloadURL(response.ref))
        .then(imageURL => {
          addDoc(mealsRef, {
            name: mealName,
            price: mealPrice,
            restaurantId: restaurantId,
            restaurantSlug: restaurantSlug,
            imageURL: imageURL,
            fileName: fileName,
            timeAdded: new Date(),
          })
            .then(() => {
              fetchMeals();
              toast.success("Meal added 🎉");
              setLoading(false);
            })
        })
        .catch((error) => {
          toast.error("Failed to add meal");
          setLoading(false);
          // console.log(error.message);
        });
    }
  }


  return (
    <Row className="mb-5">
      <Col>
        <h3 className="font-weight-bold mt-3 mb-5">Add a meal</h3>
        <div className="auth-animation">
          <Row>
            <Col md={9} lg={8}>
              <Form onSubmit={(evt) => { evt.preventDefault() }}>
                <div className="form-label-group">
                  <input onChange={(evt) => setMealName(evt.target.value)} type="text" className="input" id="inputName" placeholder="Name" />
                </div>
                <div className="form-label-group flex flex-row">
                  <input onChange={(evt) => setMealPrice(parseInt(evt.target.value))} type="text" className="input" id="inputPrice" placeholder="Price" />
                </div>
                <div className="form-label-group mt-4">
                  <Form.File
                    id="custom-file"
                    label={mealFileName || 'Attach Meal Image'}
                    custom
                    ref={mealImageFile}
                    accept="image/*"
                    onChange={() => setMealFileName(mealImageFile.current.files[0].name)}
                  />
                </div>
                <button disabled={loading ? true : false} onClick={addMeal} className="btn btn-lg btn-primary btn-block btn-login text-uppercase font-weight-bold mb-2">
                  {!loading && <span>Add Meal</span>}
                  {loading && <Image style={{ width: '30px' }} fluid src="/img/loading-2.svg" alt="loading" />}
                </button>
              </Form>
            </Col>
          </Row>
        </div>
      </Col>
    </Row>
  )
}

const Meal = ({ meal, displayEditMealModal, displayDeleteMealModal }) => {
  return (
    <Col md={6}>
      <MealCard
        boxClass="border shadow"
        price={meal.price}
        mealImage={meal.imageURL}
        imageclassName='w-50'
        mealName={meal.name}
        onEditClick={() => displayEditMealModal(meal)}
        onDeleteClick={() => displayDeleteMealModal(meal)}
      />
    </Col>
  )
}

export default Meals;

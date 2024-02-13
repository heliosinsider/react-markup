import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ImageMarker from "react-image-marker";
import axios from "axios";
import "./ImageUpload.css";

const ImageUploadComponent = () => {
  const [imageName, setImageName] = useState([]);
  const [file, setFile] = useState();
  const [imageFeild, setImageFeild] = useState(null);
  const [personData, setPersonData] = useState();
  const [selectedPerson, setSelectedPerson] = useState({});
  let [markers, setMarkers] = useState([]);

  const handleChangeName = (e) => {
    setImageName({
      ...imageName,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFeild(e.target.files[0]);
    }
    setFile(URL.createObjectURL(e.target.files[0]));
  };

  const handleMarkerPersonChange = (index, selectedPerson) => {
    setSelectedPerson((prev) => ({
      ...prev,
      [index]: selectedPerson,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!imageFeild) {
      toast.warning("Please select an image to upload");
      return;
    }

    const coordinates = markers.map((marker) => ({
      x_coordinate: marker.left,
      y_coordinate: marker.top,
    }));

    const formData = new FormData();
    formData.append("image", imageFeild);
    formData.append("name", imageName.name);
    formData.append("coordinates", JSON.stringify(coordinates));

    Object.entries(selectedPerson).forEach(([index, value]) => {
      formData.append(`person_key`, value);
    });

    axios
      .post("your-api-endpoint", formData)
      .then((response) => {
        toast.success("Image uploaded successfully!");
        window.location.reload();
      })
      .catch((error) => {});
  };

  //   useEffect(() => {
  //     const fetchData = async () => {
  //       try {
  //         const response = await axios.get("your-api-endpoint");
  //         setPersonData(response.data.results);
  //       } catch (error) {}
  //     };

  //     fetchData();
  //   }, []);

  /////////////////////////////// Example Dummy Data ///////////////////////////////////////////////////////

  useEffect(() => {
    const dummyPersonData = [];
    for (let i = 1; i <= 10; i++) {
      dummyPersonData.push({
        id: i,
        key: `Person ${i}`,
      });
    }
    setPersonData(dummyPersonData);
  }, []);

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////

  return (
    <div>
      <div>
        <form encType="multipart/form-data" onSubmit={handleSubmit}>
          <div>
            {imageFeild && (
              <div style={{ position: "relative" }}>
                <ImageMarker
                  src={file}
                  markers={markers}
                  onAddMarker={(marker) =>
                    setMarkers((prev) => [...prev, marker])
                  }
                  style={{ width: 300 }}
                />
                {markers.map((marker, index) => (
                  <div
                    key={index}
                    style={{
                      position: "absolute",
                      left: `${marker.left}%`,
                      top: `${marker.top}%`,
                    }}
                  >
                    <select
                      onChange={(e) =>
                        handleMarkerPersonChange(index, e.target.value)
                      }
                    >
                      <option value="" selected disabled>
                        Select
                      </option>
                      {personData.map((person) => (
                        <option key={person.key} value={person.id}>
                          {person.key}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <label htmlFor="imageUpload">Select Image</label>
            <input
              type="file"
              name="image"
              onChange={handleImageChange}
              id="imageUpload"
              style={{ width: "100%", height: "auto" }}
            />
          </div>
          <div>
            <label htmlFor="imageName">Image Name</label>
            <input
              type="text"
              name="name"
              onChange={handleChangeName}
              id="imageName"
            />
          </div>
          <button type="submit">Upload Image</button>
        </form>
      </div>
    </div>
  );
};

export default ImageUploadComponent;

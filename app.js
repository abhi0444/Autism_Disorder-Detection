$('#input_image').change(function(e) {
    if (e.target.files.length) {
        $(this).next('.custom-file-label').html(e.target.files[0].name);
    }
});

let input_image = document.getElementById('input_image')
form.addEventListener('submit', function(e) {

    e.preventDefault();
    // POST request using fetch API
    fetch("https://southcentralus.api.cognitive.microsoft.com/customvision/v3.0/Prediction/88284218-db72-4b5d-aa42-b68ba8eca009/classify/iterations/Iteration1/image", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/octet-stream',
                'Prediction-Key': '9500ef2955284b29bbc27a1d4456b447',
            },
            body: input_image.files[0]
        })
        .then(function(response) {
            return response.json()
        })
        .then(function(data) {
          console.log(data);
          // data_first_row probability
          let data_first_row = data.predictions[0]
          let tag_one = data_first_row.tagName
          // data_second_row Probability
          let data_second_row = data.predictions[1]
          let tag_two = data_second_row.tagName
          //extracting probability
          let a_probablity, non_a_probablity
          if (tag_one == 'Autistic') {
              a_probablity = data_first_row.probability
              non_a_probablity = data_second_row.probability
          }
          else
          {
              a_probablity = data_second_row.probability
              non_a_probablity = data_first_row.probability
          }
          let ouput
          console.log(a_probablity, non_a_probablity);
          //checking probability
          if(a_probablity > non_a_probablity) { output = "Child is Autistic" }
          else {output = "Child is Not Autism"}
          console.log(output);

          let str = `  <hr>
                          <div class="row">
                              <div class="col-md-4 mt-2">
                                  <img id="output" width="200" class="rounded" />
                              </div>
                              <div class="col-md-6 mt-2">
                                  <p class="lead">
                                      <b>Results :</b>
                                      ${output}
                                  </p>
                              </div>
                          </div>

                          <table class="table my-3">
                          <thead class="thead-light">
                              <tr>
                              <th scope="col">Tag</th>
                              <th scope="col">Probability</th>
                              </tr>
                          </thead>
                          <tbody>
                              <tr>
                              <td scope="row">Autistic</td>
                              <td>${a_probablity}%</td>
                              </tr>
                              <tr>
                              <td scope="row">Not Autistic</td>
                              <td>${non_a_probablity}%</td>
                              </tr>
                          </tbody>
                          </table>
                      `
          let result = document.getElementById('result');
          result.innerHTML = str
          let image = document.getElementById('output');
          image.src = URL.createObjectURL(input_image.files[0]);

        })
        .catch(function(error)  {
            console.error(error);
        });

});

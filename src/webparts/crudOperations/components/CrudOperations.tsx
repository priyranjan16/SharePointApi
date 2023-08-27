import * as React from 'react';
import styles from './CrudOperations.module.scss';
import { ICrudOperationsProps } from './ICrudOperationsProps';
import { escape } from '@microsoft/sp-lodash-subset';
import {SPHttpClient,SPHttpClientResponse} from '@microsoft/sp-http';
//test comments
export default class CrudOperations extends React.Component<ICrudOperationsProps, {}> {

  //Create Data
  private createItem=async():Promise<void>=>{
const fullNameElement=document.getElementById("fullName") as HTMLInputElement;
const ageElement=document.getElementById("age") as HTMLInputElement;
if(fullNameElement && ageElement){
  const body:string=JSON.stringify({
    'Title':fullNameElement.value,
    'Age':ageElement.value
  });
  try{
    const response:SPHttpClientResponse=await this.props.context.spHttpClient.post(
      `${this.props.context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('EmployeeDetails')/items`,
        SPHttpClient.configurations.v1,
        {
          headers:{
            'Accept':'application/json;odata=nometadata',
            'Content-type':'application/json;odata=nometadata',
            'odata-version':''
          },
          body:body
        }


    );
    if(response.ok){
      const responseJSON=await response.json();
      console.log(responseJSON);
      alert(`Item created successfully with ID :${responseJSON.ID} `);
    }
    else{
      const responseJSON=await response.json();
      console.log(responseJSON);
      alert(`Something went wrong please check the browser console for errors`);
    }
  }
  catch(eror){
    console.log(eror);
    alert('An error occurred while creating the item');
  }
}
else{
  console.log("Eroor full name and age are not dound in list");
}

  }

  //Get Item By Id
  private getItemById=():void=>{
    const idElement=document.getElementById("itemId") as HTMLInputElement|null;
    if(idElement?.value){
      const id:number=Number(idElement.value);
      if(id>0){
        this.props.context.spHttpClient.get(`${this.props.context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('EmployeeDetails')/items(${id})`,
        SPHttpClient.configurations.v1,
        {
          headers:{
            'Accept':'application/json;odata=nometadata',
            'Content-type':'application/json;odata=nometadata',
            'odata-version':''
          }
        }
        )
        .then((response:SPHttpClientResponse)=>{
          if(response.ok){
            response.json().then((responseJSON)=>{
              console.log(responseJSON);
              document.getElementById('fullName')?.setAttribute('value',responseJSON.Title);
              document.getElementById('age')?.setAttribute('value',responseJSON.Age);
            });
          }
          else{
            response.json().then((responseJSON)=>{
              console.log(responseJSON);
              alert(`Something went wrong please check the rrorr`);
            });
          }
        })
        .catch((error)=>{
          console.error(error);
        });
      }
      else{
        alert(`Please enter a valid id`);
      }
    }
    else{
      console.log("Eror element id is not found");
    }
  }

// Get All Items
private getAllItems=():void=>{
  this.props.context.spHttpClient.get(`${this.props.context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('EmployeeDetails')/items`,
  
  SPHttpClient.configurations.v1,{
    headers:{
      'Accept':'application/json;odata=nometadata',
      'odata-version':''
    }
  }
  )
  .then((response:SPHttpClientResponse)=>{
    if(response.ok){
      response.json().then((responseJSON)=>{
        var html=`<table><tr><th>ID</th><th>Full Name</th><th>Age</th></tr>`;
        responseJSON.value.map((items:any,index:any)=>{
          html+=`<tr><td>${items.ID}</td><td>${items.Title}</td><td>${items.Age}</td></tr>`;
        });
        html+=`</table>`;
        const element=document.getElementById("allItems");
        if(element){
          element.innerHTML=html;
        }
        console.log(responseJSON);
      });
    }
    else{
      response.json().then((responseJSON)=>{
        console.log(responseJSON);
        alert(`Something went wrong please check the browser console for correct info...`);
      });
    }
  })
  .catch((err)=>{
    console.error(err);
  })
}
//Update Item
private updateItems=():void=>{
const idElement=document.getElementById('itemId') as HTMLInputElement;
if(idElement){
  const id:number=parseInt(idElement.value);
  const fullNameElement=document.getElementById("fullName") as HTMLInputElement;
  const ageElement=document.getElementById("age") as HTMLInputElement;
  if(fullNameElement && ageElement){
    const body:string=JSON.stringify({
      'Title':fullNameElement.value,
      'Age':ageElement.value
    });
    if(id>0){
      this.props.context.spHttpClient.post(`${this.props.context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('EmployeeDetails')/items(${id})`,
      SPHttpClient.configurations.v1,
      {
        headers:{
          'Accept':'application/json;odata=nometadata',
          'Content-type':'application/json;odata=nometadata',
          'odata-version':'',
          'IF-MATCH':'*',
          'X-HTTP-Method':'MERGE'
        },
        body:body
      }
      )
      .then((response:SPHttpClientResponse)=>{
        if(response.ok){
          alert(`Item with ID: ${id} updated successfully`);
        }
        else{
          response.json().then((responseJSON)=>{
            console.log(responseJSON);
            alert(`Something went wrong check the error...`);
          });
        }
      })
      .catch((error)=>{
        console.error("error occured",error);
      });
    }
    else{
      alert(`Please enter the valid item id`);
    }
  }
  else{
    alert(`Full Name and Age element are not found`);
    }
}
else{
  alert(`Item ID elemnt is not found`);
}
}
//delet Item
private deleteItem=():void=>{
  const idElement=document.getElementById('itemId') as HTMLInputElement;
  const id:number=parseInt(idElement?.value||"0");
  if(id>0){
    this.props.context.spHttpClient.post(`${this.props.context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('EmployeeDetails')/items(${id})`,
    SPHttpClient.configurations.v1,
    {
      headers:{
        'Accept':'application/json;odata=nometadata',
        'Content-type':'application/json;odata=nometadata',
        'odata-version':'',
        'IF-MATCH':'*',
        'X-HTTP-Method':'DELETE'
      },
    }
    )
    .then((response:SPHttpClientResponse)=>{
      if(response.ok){
        alert(`Item ID: ${id} deleted successfully`);
      }
      else{
        alert(`Something wnet wrong`);
      console.log(response.json());
      }
    });
  }
  else{
    alert(`Please enter valid item id`)
  }
}
  public render(): React.ReactElement<ICrudOperationsProps> {
   
    return (
    <>
    <div className={styles.crudOperations}>
      <div className={styles.container}>
        <div className={styles.row}>
          <div className={styles.column}>
            <p className={styles.description}>{escape(this.props.description)}</p>
            <div className={styles.itemField}>
              <div className={styles.fieldLabel}>Item ID:</div>
              <input type="text" id="itemId"></input>
            </div>
            <div className={styles.itemField}>
              <div className={styles.fieldLabel}>Full Name:</div>
              <input type="text" id="fullName"></input>
            </div>
            <div className={styles.itemField}>
              <div className={styles.fieldLabel}>Age:</div>
              <input type="text" id="age"></input>
            </div>
            <div className={styles.itemField}>
              <div className={styles.fieldLabel}>All Items:</div>
              <div id="allItems"></div>
            </div>
            <div className={styles.buttonSection}>
              <div className={styles.button}>
                <span className={styles.label} onClick={this.createItem}>Create</span>
              </div>
              <div className={styles.button}>
                <span className={styles.label} onClick={this.getItemById}>Read</span>
              </div>
              <div className={styles.button}>
                <span className={styles.label} onClick={this.getAllItems}>Read All</span>
              </div>
              <div className={styles.button}>
                <span className={styles.label} onClick={this.updateItems}>Update</span>
              </div>
              <div className={styles.button}>
                <span className={styles.label} onClick={this.deleteItem}>Delete</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
    );
  }
}

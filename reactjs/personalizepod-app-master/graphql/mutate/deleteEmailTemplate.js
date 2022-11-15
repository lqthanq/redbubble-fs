import gql from "graphql-tag";


export default gql`
  mutation($id:String!){
    deleteEmailTemplate:deleteEmailTemplate(id:$id)
  }

`
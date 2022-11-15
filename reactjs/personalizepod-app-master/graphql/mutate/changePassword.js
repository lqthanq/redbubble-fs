import gql from "graphql-tag";
export default gql`
	mutation changePassword($current_pass: String!,$new_pass:String!){
		changePassword(current_pass:$current_pass,new_pass:$new_pass){
			token
		}
	}
`
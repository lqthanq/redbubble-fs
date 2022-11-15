export const Tokens = {
  customer: {
    name: "Customer",
    mergeTags: {
      first_name: {
        name: "First Name",
        value: "{{.customer.FirstName}}",
        sample: "Steven"
      },
      last_name: {
        name: "Last Name",
        value: "{{.customer.LastName}}",
        sample: "Hoang"
      }
    }
  },
  user: {
    name: "User",
    mergeTags: {
      first_name: {
        name: "First Name",
        value: "{{.user.FirstName}}",
        sample: "Steven"
      },
      last_name: {
        name: "Last Name",
        value: "{{.user.LastName}}",
        sample: "Hoang"
      },
      email: {
        name: "Email",
        value: "{{.user.Email}}",
        sample: "example@example.com"
      }
    }
  },
  shipping_address: {
    name: "Shipping Address",
    mergeTags: {
      street_1: {
        name: "Street 1",
        value: "{{.shippingAddress.Address1}}"
      },
      street_2: {
        name: "Street 2",
        value: "{{.shippingAddress.Address2}}"
      },
      city: {
        name: "City",
        value: "{{.shippingAddress.City}}"
      },
      state: {
        name: "State",
        value: "{{.shippingAddress.State}}"
      },
      zip: {
        name: "Zip",
        value: "{{.shippingAddress.Zip}}"
      }
    }
  },
  order: {
    name: "Order",
    mergeTags: {
      order_id: {
        name: "Order ID",
        value: "{{.order.ID}}"
      },
      product_title: {
        name: "Product Title",
        value: "{{.product.Title}}"
      }
    }
  },
  one_time_token_url: {
    name: "One Time Token URL",
    value: "{{.one_time_token_url}}"
  }
};

import { Button, Html, Img, Section, Text } from "@react-email/components";

const forgotPassword = ({
    forgotCode,
    userEmail,
    userName ,
  }) => {
  return (
    <Html>

<Section
  style={{ marginTop: '16px', textAlign: 'center', marginBottom: '16px' }}
>
  <Section
    style={{
      display: 'inline-block',
      textAlign: 'left',
      width: '100%',
      maxWidth: 250,
      verticalAlign: 'top',
    }}
  >
    <Text
      style={{
        margin: '0px',
        marginTop: '8px',
        fontSize: 20,
        lineHeight: '28px',
        fontWeight: 600,
        color: 'rgb(17,24,39)',
      }}
    >
Reset Your Password
    </Text>
    <Text
      style={{
        marginTop: 8,
        fontSize: 16,
        lineHeight: '24px',
        color: 'rgb(107,114,128)',
      }}
    >
We received a request to reset your account password

    </Text>
    
    <Text
      style={{
        marginTop: 8,
        fontSize: 30,
        lineHeight: '24px',
        color: 'rgb(107,114,128)',
      }}
    >
    Hello, {userName}!
    </Text>
    <Button
      href={`http://localhost:3000/reset-password?code=${forgotCode}&email=${userEmail}`}
      style={{
         backgroundColor: '#10b981',
          color: '#ffffff',
          marginTop: '10px',
          padding: '10px 20px',
          borderRadius: '4px',
          textDecoration: 'none',
          fontSize: '16px',
      }}>
Reset Password
    </Button>
    
  </Section>
  <Section
    style={{
      display: 'inline-block',
      marginTop: 8,
      marginBottom: 8,
      width: '100%',
      maxWidth: 220,
      verticalAlign: 'top',
    }}
  >
    <Img
      alt="An aesthetic picture taken of an Iphone, flowers, glasses and a card that reads 'Gucci, bloom' coming out of a leathered bag with a ziper"
      height={220}
      src="https://res.cloudinary.com/dwzi1o7b4/image/upload/v1753117622/cheapdeals_pykcac.png"
      style={{
        borderRadius: 8,
        objectFit: 'cover',
      }}
      width={220}
    />
  </Section>

  
</Section>
    </Html>

  )
}

export default forgotPassword

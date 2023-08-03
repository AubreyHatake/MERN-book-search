// React setup
import React from 'react';
import { Jumbotron, Container, Row, Card, Button, Col, CardGroup } from 'react-bootstrap';
// import the 'auth' setup
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';
// need these to refactor for GraphQL API
import { useQuery, useMutation } from '@apollo/client';
import { REMOVE_BOOK } from '../utils/mutations';
import { GET_ME } from '../utils/queries';

const SavedBooks = () => {
  const { loading, data } = useQuery(GET_ME);
  const [removeBook, { error }] = useMutation(REMOVE_BOOK);
  
  const userData = data?.me || {};

  // function to delete book from database
  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    // new code
    try {
    const {data} = await removeBook({ variables: { bookId } });
        console.log('Deleted record: ', data);
      // also remove from Localstorage
      removeBookId(bookId);
    } catch (err) {
      // display any caught errors here
        console.error(err);
    }
  };

  // if data isn't here yet, say so
  // new code
  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <Jumbotron fluid className='text-light bg-dark'>
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </Jumbotron>
      <Container>
        <h2>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        </Container>
      <Row xs={1} md={4}  className='container'>
        <Col md="12" className='flex'>
          <CardGroup>
          {userData.savedBooks.map((book) => {
            return (
              <Card style={{ width: '18rem' }} key={book.bookId} border='dark'>
                {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className='small'>Authors: {book.authors}</p>
                  <Card.Text>{book.description}</Card.Text>
                  <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                    Delete this Book!
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
          </CardGroup>
        </Col>
      </Row >
    </>
  );
};

export default SavedBooks;


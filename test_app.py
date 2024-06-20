import pytest
from app import app

@pytest.fixture
def client():
    """Fixture para simular un cliente HTTP para la aplicación Flask."""
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_index(client):
    """R001 Prueba para verificar la página principal ('/')."""
    rv = client.get('/')
    assert rv.status_code == 200
    assert b'<title>Calculadora</title>' in rv.data

def test_calculate_success(client):
    """R002 Prueba para verificar el cálculo exitoso."""
    rv = client.post('/calculate', data={'expression': '2+2'})
    assert rv.status_code == 200
    assert b'"result": "4"' in rv.data


def test_calculate_division_by_zero(client):
    """R003 Prueba para verificar el manejo de división por cero."""
    rv = client.post('/calculate', data={'expression': '1/0'})
    assert rv.status_code == 200
    assert b'Error' in rv.data

def test_calculate_invalid_expression(client):
    """R004 Prueba para verificar el manejo de expresiones inválidas."""
    rv = client.post('/calculate', data={'expression': '1 + '})  # Expresión incompleta
    assert rv.status_code == 200
    assert b'Error' in rv.data

def test_calculate_no_expression(client):
    """R005 Prueba para verificar el manejo cuando no se proporciona una expresión."""
    rv = client.post('/calculate')
    assert rv.status_code == 200
    assert b'Error' in rv.data

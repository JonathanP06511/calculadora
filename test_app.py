import pytest
from app import app

@pytest.fixture
def client():
    """Fixture para simular un cliente HTTP para la aplicación Flask."""
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_index(client):
    """PU-01 Verifica que la página principal es accesible"""
    rv = client.get('/')
    assert rv.status_code == 200
    assert b'<title>Calculadora</title>' in rv.data

def test_calculate_success(client):
    """PU-02 Verifica que la aplicación realiza la suma 2 + 2 correctamente.."""
    rv = client.post('/calculate', data={'expression': '2+2'})
    assert rv.status_code == 200
    assert b'"result": "4"' in rv.data


def test_calculate_division_by_zero(client):
    """PU-03 Verifica que la aplicación muestra un error al intentar dividir por cero.."""
    rv = client.post('/calculate', data={'expression': '1/0'})
    assert rv.status_code == 200
    assert b'Error' in rv.data

def test_calculate_invalid_expression(client):
    """PU-04 Verifica que la aplicación muestra un error al ingresar una expresión incompleta."""
    rv = client.post('/calculate', data={'expression': '1 + '})  # Expresión incompleta
    assert rv.status_code == 200
    assert b'Error' in rv.data

def test_calculate_no_expression(client):
    """PU-05 Verificar el manejo cuando no se proporciona una expresión."""
    rv = client.post('/calculate')
    assert rv.status_code == 200
    assert b'Error' in rv.data


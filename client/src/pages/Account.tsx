import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks.tsx';
import {addAddress, fetchUserData, updatePersonalInfo, uploadAvatar} from '../slices/userSlice';
import { useLogout } from '../hooks/auth/useLogout';
import { Container, Button, Row, Col, Card, Image, Alert, Table, Spinner } from 'react-bootstrap';
import { motion } from 'framer-motion';
import ChangePasswordModal from '../../src/components/modal/changePasswordModal.tsx';
import UploadAvatarModal from '../../src/components/modal/updateAvatarModal.tsx';
import ChangeAddressModal from "../components/modal/ChangeAddressModal.tsx";
import ModalAddPersonalInfo from '../components/modal/AddPersonalInfoModal'; // Импорт нового модального окна




const Account: React.FC = () => {
    const dispatch = useAppDispatch();
    const { user, orderHistory, loading, error } = useAppSelector((state) => state.user);
    const { logout } = useLogout();
    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
    const [showUploadAvatarModal, setShowUploadAvatarModal] = useState(false);
    const [message, setMessage] = useState('');
    const [variant, setVariant] = useState<'success' | 'danger'>('success');
    const token = localStorage.getItem('token'); // Используем токен для авторизации
    const avatarUrl = user?.profilePicture || '/default-avatar.png';


    const [isHovered, setIsHovered] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [showChangeAddressModal, setShowChangeAddressModal] = useState(false);
    const [showPersonalInfoModal, setShowPersonalInfoModal] = useState(false);

    const createButtonState = () => ({
        isHovered: false,
        isActive: false,
    });
    const handleAddPersonalInfo = (firstName: string, lastName: string, phoneNumber: string) => {
        dispatch(updatePersonalInfo({ firstName, lastName, phone}));
        setShowPersonalInfoModal(false);
        setMessage('Личная информация успешно обновлена');
        setVariant('success');
    };

    const formatValue = (value: string | undefined | null, defaultValue: string = 'Не указан') =>
        value && value !== 'None' ? value : defaultValue;

    const styles = {
        container: {
            minHeight: '80vh',
            padding: '20px',
        },
        card: {
            borderRadius: '15px',
            boxShadow: '0 4px 8px rgba(119, 119, 119, 0.7)',
            marginBottom: '20px',
            border: 'none',
        },
        cardHeader: {
            backgroundColor: '#f8f9fa',
            borderBottom: '2px solid #81c784',
            borderRadius: '15px 15px 0 0',
            fontWeight: 'bold',
            color: '#2e7d32',
        },
        button: {
            backgroundColor: '#ffffff',
            borderColor: '#81c784',
            color: '#81c784',
            border: '2px solid #81c784',
            borderRadius: '5px',
            padding: '8px 16px',
            margin: '5px',
            fontWeight: 'bold',
            transition: 'all 0.3s ease',
        },
        buttonHover: {
            backgroundColor: '#81c784',
            color: '#ffffff',
        },
        buttonActive: {
            backgroundColor: '#66bb6a',
            color: '#ffffff',
            borderColor: '#66bb6a',
        },
        logoutButton: {
            backgroundColor: '#ffffff',
            borderColor: '#f44336',
            color: '#f44336',
            border: '2px solid #f44336',
            borderRadius: '5px',
            padding: '8px 16px',
            margin: '5px',
            fontWeight: 'bold',
            transition: 'all 0.3s ease',
        },
        logoutButtonHover: {
            backgroundColor: '#f44336',
            color: '#ffffff',
        },
        profileImage: {
            width: '100px',
            height: '100px',
            objectFit: 'cover',
            border: '3px solid #81c784',
            padding: '3px',
        },
        table: {
            borderRadius: '10px',
            overflow: 'hidden',
        },
        tableHeader: {
            backgroundColor: '#81c784',
            color: '#ffffff',
        },
    };


    useEffect(() => {
        if (token) {
            console.log('[INFO] Token used for fetch:', token);
            dispatch(fetchUserData(token))
                .then((response) => {
                    if (response.meta.requestStatus === 'fulfilled') {
                        console.log('[INFO] Fetched user data:', response.payload);
                    } else {
                        console.error('[ERROR] Fetching user data failed:', response.error.message);
                    }
                })
                .catch((error) => {
                    console.error('[ERROR] Unexpected fetch error:', error);
                });
        } else {
            console.warn('[WARNING] Token is missing.');
        }
    }, [dispatch, token]);

    // const formatValue = (value: string | undefined | null, defaultValue: string = 'Не указан') =>  value && value !== 'None' ? value : defaultValue;

    const handleUpdatePassword = async (newPassword: string) => {
        try {
            console.log('[INFO] Updating password with:', newPassword);
            setMessage('Пароль успешно обновлен');
            setVariant('success');
        } catch {
            console.error('[ERROR] Error updating password');
            setMessage('Не удалось обновить пароль');
            setVariant('danger');
        }
        setShowChangePasswordModal(false);
    };

    const handleUpdateAvatar = async (file: File) => {
        console.log('[INFO] handleUpdateAvatar called with file:', file);
        try {
            console.log('[INFO] Updating avatar with file:', file);
            await dispatch(uploadAvatar(file)).unwrap();
            setMessage('Аватар успешно обновлен');
            setVariant('success');
        } catch (error) {
            console.error('[ERROR] Error updating avatar:', error);
            setMessage('Не удалось обновить аватар');
            setVariant('danger');
        }
        setShowUploadAvatarModal(false);
    };

    const handleLogout = async () => {
        await logout();
        window.location.href = '/auth';
    };

    const handleUpdateAddress = async (address: {
        addressId?: string;  // Optional ID for existing address
        street: string;
        city: string;
        postalCode: string;
        country: string
    }) => {
        try {
            console.log('[INFO] Updating/Adding address with:', address);
            await dispatch(addAddress(address)).unwrap();
            setMessage('Адрес успешно обновлен');
            setVariant('success');
        } catch (error) {
            console.error('[ERROR] Error updating address:', error);
            setMessage('Не удалось обновить адрес');
            setVariant('danger');
        }
        setShowChangeAddressModal(false);
    };
    if (loading) {
        return (
            <Container
                style={{
                    minHeight: '80vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Spinner animation="border" style={{ color: '#81c784' }} />
            </Container>
        );
    }
    console.log(user)
    {console.log(styles.profileImage)}
    return (
        <Container style={styles.container}>
            <motion.h2
                style={styles.title}
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                transition={{duration: 1}}
            >
                Личный кабинет
            </motion.h2>

            {message && (
                <motion.div
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    transition={{duration: 1.2}}
                >
                    <Alert variant={variant}>{message}</Alert>
                </motion.div>
            )}
            {error && (
                <motion.div
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    transition={{duration: 1.2}}
                >
                    <Alert variant="danger">{error}</Alert>
                </motion.div>
            )}

            <Row>
                <Col md={6}>
                    <motion.div
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        transition={{duration: 1.4}}
                    >
                        <Card style={styles.card}>
                            <Card.Header style={styles.cardHeader}>Личная информация</Card.Header>
                            <Card.Body>
                                <Image
                                    src={"http://localhost:3000" + avatarUrl}
                                    roundedCircle
                                    className="mb-3"

                                    style={styles.profileImage}
                                />

                                <p>Имя пользователя: <strong>{formatValue(user?.message)}</strong></p>
                                <p>Email: <strong>{formatValue(user?.mail)}</strong></p>
                                <p>Имя: <strong>{formatValue(user?.firstName)}</strong></p>
                                <p>Фамилия: <strong>{formatValue(user?.lastName)}</strong></p>
                                <p>Номер телефона: <strong>{formatValue(user?.phone)}</strong></p>
                                <Button
                                    style={{
                                        ...styles.button,
                                        ...(isHovered ? styles.buttonHover : {}),
                                        ...(isActive ? styles.buttonActive : {})
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor;
                                        e.currentTarget.style.color = styles.buttonHover.color;
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = styles.button.backgroundColor;
                                        e.currentTarget.style.color = styles.button.color;
                                    }}
                                    onMouseDown={(e) => {
                                        e.currentTarget.style.backgroundColor = styles.buttonActive.backgroundColor;
                                    }}
                                    onMouseUp={(e) => {
                                        e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor;
                                    }}
                                    onClick={() => setShowPersonalInfoModal(true)}
                                >
                                    Добавить личную информацию
                                </Button>
                                <Button
                                    style={{
                                        ...styles.button,
                                        ...(isHovered ? styles.buttonHover : {}),
                                        ...(isActive ? styles.buttonActive : {})
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor;
                                        e.currentTarget.style.color = styles.buttonHover.color;
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = styles.button.backgroundColor;
                                        e.currentTarget.style.color = styles.button.color;
                                    }}
                                    onMouseDown={(e) => {
                                        e.currentTarget.style.backgroundColor = styles.buttonActive.backgroundColor;
                                    }}
                                    onMouseUp={(e) => {
                                        e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor;
                                    }}
                                    onClick={() => setShowChangePasswordModal(true)}
                                >
                                    Сменить пароль
                                </Button>
                                <Button
                                    style={{
                                        ...styles.button,
                                        ...(isHovered ? styles.buttonHover : {}),
                                        ...(isActive ? styles.buttonActive : {})
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor;
                                        e.currentTarget.style.color = styles.buttonHover.color;
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = styles.button.backgroundColor;
                                        e.currentTarget.style.color = styles.button.color;
                                    }}
                                    onMouseDown={(e) => {
                                        e.currentTarget.style.backgroundColor = styles.buttonActive.backgroundColor;
                                    }}
                                    onMouseUp={(e) => {
                                        e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor;
                                    }}
                                    onClick={() => setShowUploadAvatarModal(true)}
                                    className="ml-2"
                                >
                                    Изменить аватар
                                </Button>
                            </Card.Body>
                        </Card>
                    </motion.div>
                </Col>

                <Col md={6}>
                    <motion.div
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        transition={{duration: 1.6}}
                    >
                        <Card className="mb-4">
                            <Card.Header style={styles.cardHeader}>Информация о покупках</Card.Header>
                            <Card.Body>
                                <p>Баланс бонусных баллов: <strong>{formatValue(user?.bonusPoints, '0')}</strong></p>
                                <p>Статус аккаунта: <strong>{formatValue(user?.status, 'Обычный')}</strong></p>
                                <p>Дата
                                    регистрации: <strong>{formatValue(new Date(user?.createdAt).toLocaleDateString())}</strong>
                                </p>
                                <p>Адрес:
                                    <strong>
                                        {formatValue(user?.address?.street)}
                                        , {formatValue(user?.address?.city)}
                                    </strong>
                                </p>
                            </Card.Body>
                            <Button
                                style={{
                                    ...styles.button,
                                    ...(isHovered ? styles.buttonHover : {}),
                                    ...(isActive ? styles.buttonActive : {}),
                                }}
                                onClick={() => setShowChangeAddressModal(true)}
                            >
                                Изменить адрес
                            </Button>
                        </Card>
                    </motion.div>

                </Col>
            </Row>

            <Row>
                <Col>
                    <motion.div
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        transition={{duration: 1.8}}
                    >
                        <Card className="mb-4">
                            <Card.Header style={styles.cardHeader}>История заказов</Card.Header>
                            <Card.Body>
                                {orderHistory && orderHistory.length > 0 ? (
                                    <Table striped bordered hover responsive>
                                        <thead>
                                        <tr>
                                            <th>Дата</th>
                                            <th>Заказ №</th>
                                            <th>Статус</th>
                                            <th>Сумма</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {orderHistory.map((order, index) => (
                                            <tr key={index}>
                                                <td>{formatValue(order.date)}</td>
                                                <td>{formatValue(order.orderNumber)}</td>
                                                <td>{formatValue(order.status)}</td>
                                                <td>{order.totalAmount ? `${order.totalAmount} ₽` : 'Не указано'}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </Table>
                                ) : (
                                    <p>Нет истории заказов.</p>
                                )}
                            </Card.Body>
                        </Card>
                    </motion.div>
                </Col>

            </Row>

            <Button
                variant="danger"
                style={{
                    ...styles.logoutButton,
                    ...(isHovered ? styles.logoutButtonHover : {})
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = styles.logoutButtonHover.backgroundColor;
                    e.currentTarget.style.color = styles.logoutButtonHover.color;
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = styles.logoutButton.backgroundColor;
                    e.currentTarget.style.color = styles.logoutButton.color;
                }}
                onMouseDown={(e) => {
                    e.currentTarget.style.backgroundColor = styles.buttonActive.backgroundColor;
                }}
                onMouseUp={(e) => {
                    e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor;
                }}
                onClick={handleLogout}
            >
                Выйти
            </Button>

            <ChangePasswordModal
                show={showChangePasswordModal}
                onHide={() => setShowChangePasswordModal(false)}
                onSubmit={handleUpdatePassword}
            />
            <UploadAvatarModal
                show={showUploadAvatarModal}
                onHide={() => setShowUploadAvatarModal(false)}
                onSubmit={handleUpdateAvatar}
                currentAvatar={user?.profilePicture || '/default-avatar.png'}
            />

            <ChangeAddressModal
                show={showChangeAddressModal}
                onHide={() => setShowChangeAddressModal(false)}
                onSubmit={handleUpdateAddress}
                currentAddress={{
                    street: user?.address?.street?.trim() === 'None' || !user?.address?.street ? 'Не указано' : user.address.street,
                    city: user?.address?.city?.trim() === 'None' || !user?.address?.city ? 'Не указано' : user.address.city,
                    postalCode: user?.address?.postalCode?.trim() === 'None' || !user?.address?.postalCode ? 'Не указано' : user.address.postalCode,
                    country: user?.address?.country?.trim() === 'None' || !user?.address?.country ? 'Не указано' : user.address.country,
                }}
            />
            <ModalAddPersonalInfo
                show={showPersonalInfoModal}
                handleClose={() => setShowPersonalInfoModal(false)}
                handleSave={handleAddPersonalInfo}
            />
        </Container>
    );
};

export default Account;
